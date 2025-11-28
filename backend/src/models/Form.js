const mongoose = require('mongoose');

const conditionalRulesSchema = new mongoose.Schema({
    logic: {
        type: String,
        enum: ['AND', 'OR'],
        required: true
    },
    conditions: [{
        questionKey: { type: String, required: true },
        operator: {
            type: String,
            enum: ['equals', 'notEquals', 'contains'],
            required: true
        },
        value: mongoose.Schema.Types.Mixed
    }]
}, { _id: false });

const questionSchema = new mongoose.Schema({
    questionKey: { type: String, required: true },
    fieldId: { type: String, required: true },
    label: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['shortText', 'longText', 'singleSelect', 'multiSelect', 'attachment']
    },
    required: { type: Boolean, default: false },
    options: [String],
    conditionalRules: conditionalRulesSchema
}, { _id: false });

const formSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    airtableBaseId: {
        type: String,
        required: true
    },
    airtableTableId: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

formSchema.index({ owner: 1, createdAt: -1 });

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
