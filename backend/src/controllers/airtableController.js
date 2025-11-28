const airtableHelper = require('../config/airtable');

exports.listBases = async (req, res) => {
    try {
        if (req.user.isTokenExpired()) {
            const newTokens = await airtableHelper.refreshAccessToken(req.user.refreshToken);
            req.user.accessToken = newTokens.access_token;
            req.user.tokenExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
            await req.user.save();
        }

        const bases = await airtableHelper.listBases(req.user.accessToken);
        res.json({ bases });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listTables = async (req, res) => {
    try {
        const { baseId } = req.params;

        if (req.user.isTokenExpired()) {
            const newTokens = await airtableHelper.refreshAccessToken(req.user.refreshToken);
            req.user.accessToken = newTokens.access_token;
            req.user.tokenExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
            await req.user.save();
        }

        const schema = await airtableHelper.getBaseSchema(req.user.accessToken, baseId);
        res.json({ tables: schema.tables });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listFields = async (req, res) => {
    try {
        const { baseId, tableId } = req.params;

        if (req.user.isTokenExpired()) {
            const newTokens = await airtableHelper.refreshAccessToken(req.user.refreshToken);
            req.user.accessToken = newTokens.access_token;
            req.user.tokenExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
            await req.user.save();
        }

        const schema = await airtableHelper.getBaseSchema(req.user.accessToken, baseId);
        const table = schema.tables.find(t => t.id === tableId);

        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        const SUPPORTED_TYPES = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];
        const supportedFields = table.fields.filter(field => SUPPORTED_TYPES.includes(field.type));

        const fields = supportedFields.map(field => ({
            id: field.id,
            name: field.name,
            type: mapAirtableTypeToAppType(field.type),
            options: field.options?.choices?.map(c => c.name) || null
        }));

        res.json({ fields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function mapAirtableTypeToAppType(airtableType) {
    const typeMap = {
        'singleLineText': 'shortText',
        'multilineText': 'longText',
        'singleSelect': 'singleSelect',
        'multipleSelects': 'multiSelect',
        'multipleAttachments': 'attachment'
    };
    return typeMap[airtableType] || 'unknown';
}
