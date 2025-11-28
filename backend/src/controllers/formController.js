const Form = require('../models/Form');

exports.createForm = async (req, res) => {
    try {
        const { title, description, airtableBaseId, airtableTableId, questions } = req.body;

        if (!title || !airtableBaseId || !airtableTableId || !questions || questions.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        for (const question of questions) {
            if (!question.questionKey || !question.fieldId || !question.label || !question.type) {
                return res.status(400).json({ error: 'Invalid question format' });
            }
        }

        const form = new Form({
            owner: req.userId,
            title,
            description,
            airtableBaseId,
            airtableTableId,
            questions
        });

        await form.save();
        res.status(201).json({ form });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listUserForms = async (req, res) => {
    try {
        const forms = await Form.find({ owner: req.userId })
            .sort({ createdAt: -1 })
            .select('title description isActive createdAt updatedAt');

        res.json({ forms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getForm = async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.json({ form });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateForm = async (req, res) => {
    try {
        const form = req.resource;
        const { title, description, questions, isActive } = req.body;

        if (title) form.title = title;
        if (description !== undefined) form.description = description;
        if (questions) form.questions = questions;
        if (isActive !== undefined) form.isActive = isActive;

        await form.save();
        res.json({ form });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteForm = async (req, res) => {
    try {
        await Form.findByIdAndDelete(req.params.formId);
        res.json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
