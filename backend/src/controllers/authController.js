const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const airtableHelper = require('../config/airtable');

exports.initiateLogin = async (req, res) => {
    try {
        const state = crypto.randomBytes(16).toString('hex');
        req.session.oauthState = state;

        const authUrl = airtableHelper.getAuthorizationURL(state);
        res.redirect(authUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.handleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;

        if (state !== req.session.oauthState) {
            return res.status(400).json({ error: 'Invalid state parameter' });
        }

        const tokenData = await airtableHelper.exchangeCodeForToken(code);
        const { access_token, refresh_token, expires_in } = tokenData;

        const bases = await airtableHelper.listBases(access_token);
        const airtableUserId = `user_${crypto.randomBytes(8).toString('hex')}`;

        let user = await User.findOne({ airtableUserId });

        if (!user) {
            user = new User({
                airtableUserId,
                email: `user@airtable.com`,
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
                lastLoginAt: new Date()
            });
        } else {
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            user.tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
            user.lastLoginAt = new Date();
        }

        await user.save();

        req.session.userId = user._id;

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '7d' }
        );

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        res.json({
            id: req.user._id,
            email: req.user.email,
            displayName: req.user.displayName,
            lastLoginAt: req.user.lastLoginAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
