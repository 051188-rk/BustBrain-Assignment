const Response = require('../models/Response');
const Form = require('../models/Form');

exports.handleAirtableWebhook = async (req, res) => {
    try {
        const webhookSecret = req.headers['x-airtable-webhook-secret'];

        if (webhookSecret !== process.env.AIRTABLE_WEBHOOK_SECRET) {
            return res.status(401).json({ error: 'Invalid webhook secret' });
        }

        const { baseId, changedTablesById } = req.body;

        for (const [tableId, changes] of Object.entries(changedTablesById)) {

            if (changes.changedRecordsById) {
                for (const [recordId, recordData] of Object.entries(changes.changedRecordsById)) {
                    const response = await Response.findOne({ airtableRecordId: recordId });

                    if (response) {
                        const form = await Form.findById(response.formId);

                        if (form && recordData.fields) {
                            const updatedAnswers = {};

                            for (const question of form.questions) {
                                if (recordData.fields[question.fieldId] !== undefined) {
                                    updatedAnswers[question.questionKey] = recordData.fields[question.fieldId];
                                }
                            }

                            response.answers = updatedAnswers;
                            response.lastSyncedAt = new Date();
                            await response.save();
                        }
                    }
                }
            }

            if (changes.destroyedRecordIds) {
                for (const recordId of changes.destroyedRecordIds) {
                    const response = await Response.findOne({ airtableRecordId: recordId });

                    if (response) {
                        response.deletedInAirtable = true;
                        response.lastSyncedAt = new Date();
                        await response.save();
                    }
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
};
