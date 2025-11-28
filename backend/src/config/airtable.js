
const axios = require('axios');

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';
const AIRTABLE_OAUTH_BASE = 'https://airtable.com/oauth2/v1';

/**
 * Generate Airtable OAuth authorization URL
 * @param {string} state - CSRF protection state
 * @returns {string} Authorization URL
 */
function getAuthorizationURL(state) {
    const params = new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        response_type: 'code',
        scope: process.env.AIRTABLE_SCOPES,
        state: state
    });
    return `${AIRTABLE_OAUTH_BASE}/authorize?${params}`;
}

/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from callback
 * @returns {Promise<Object>} Token response with access_token, refresh_token
 */
async function exchangeCodeForToken(code) {
    const credentials = Buffer.from(
        `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
        `${AIRTABLE_OAUTH_BASE}/token`,
        new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.AIRTABLE_REDIRECT_URI
        }),
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data;
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken 
 * @returns {Promise<Object>} New token response
 */
async function refreshAccessToken(refreshToken) {
    const credentials = Buffer.from(
        `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
        `${AIRTABLE_OAUTH_BASE}/token`,
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data;
}

/**
 * List all bases accessible to the user
 * @param {string} accessToken 
 * @returns {Promise<Array>} List of bases
 */
async function listBases(accessToken) {
    const response = await axios.get(`${AIRTABLE_API_BASE}/meta/bases`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return response.data.bases;
}

/**
 * Get schema for a specific base (including tables)
 * @param {string} accessToken 
 * @param {string} baseId 
 * @returns {Promise<Object>} Base schema with tables
 */
async function getBaseSchema(accessToken, baseId) {
    const response = await axios.get(`${AIRTABLE_API_BASE}/meta/bases/${baseId}/tables`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return response.data;
}

/**
 * Create a new record in Airtable
 * @param {string} accessToken 
 * @param {string} baseId 
 * @param {string} tableId 
 * @param {Object} fields - Record fields
 * @returns {Promise<Object>} Created record
 */
async function createRecord(accessToken, baseId, tableId, fields) {
    const response = await axios.post(
        `${AIRTABLE_API_BASE}/${baseId}/${tableId}`,
        { fields },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}

/**
 * Update an existing record in Airtable
 * @param {string} accessToken 
 * @param {string} baseId 
 * @param {string} tableId 
 * @param {string} recordId 
 * @param {Object} fields 
 * @returns {Promise<Object>} Updated record
 */
async function updateRecord(accessToken, baseId, tableId, recordId, fields) {
    const response = await axios.patch(
        `${AIRTABLE_API_BASE}/${baseId}/${tableId}/${recordId}`,
        { fields },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}

module.exports = {
    getAuthorizationURL,
    exchangeCodeForToken,
    refreshAccessToken,
    listBases,
    getBaseSchema,
    createRecord,
    updateRecord,
    AIRTABLE_API_BASE,
    AIRTABLE_OAUTH_BASE
};
