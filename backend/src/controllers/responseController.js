const Form = require('../models/Form');
const Response = require('../models/Response');
const User = require('../models/User');
const airtableHelper = require('../config/airtable');
const { shouldShowQuestion } = require('../utils/conditionalLogic');

exports.submitResponse = async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId).populate('owner');

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        const { answers } = req.body;

        const visibleQuestions = form.questions.filter(q =>
            shouldShowQuestion(q.conditionalRules, answers)
        );

        for (const question of visibleQuestions) {
            if (question.required && !answers[question.questionKey]) {
                return res.status(400).json({
                    error: `Required field missing: ${question.label}`
                });
            }
        }

        for (const question of visibleQuestions) {
            const answer = answers[question.questionKey];

            if (question.type === 'singleSelect' && question.options && answer) {
                if (!question.options.includes(answer)) {
                    return res.status(400).json({ error: `Invalid option for ${question.label}` });
                }
            }

            if (question.type === 'multiSelect' && question.options && answer) {
                if (!Array.isArray(answer) || !answer.every(a => question.options.includes(a))) {
                    return res.status(400).json({ error: `Invalid options for ${question.label}` });
                }
            }
        }

        const airtableFields = {};
        for (const question of form.questions) {
            if (answers[question.questionKey] !== undefined) {
                airtableFields[question.fieldId] = answers[question.questionKey];
            }
        }

        const airtableRecord = await airtableHelper.createRecord(
            form.owner.accessToken,
            form.airtableBaseId,
            form.airtableTableId,
            airtableFields
        );

        const response = new Response({
            formId: form._id,
            airtableRecordId: airtableRecord.id,
            answers,
            submitterIp: req.ip,
            submitterUserAgent: req.headers['user-agent']
        });

        await response.save();

        res.status(201).json({
            message: 'Response submitted successfully',
            responseId: response._id
        });
    } catch (error) {
        console.error('Submit response error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.listResponses = async (req, res) => {
    try {
        const responses = await Response.find({
            formId: req.params.formId
        })
            .sort({ createdAt: -1 })
            .select('answers createdAt deletedInAirtable airtableRecordId');

        res.json({ responses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
