const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
            req.userId = decoded.userId;
            return next();
        }

        if (req.session && req.session.userId) {
            req.userId = req.session.userId;
            return next();
        }

        return res.status(401).json({ error: 'Not authenticated' });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const loadUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error loading user' });
    }
};

const requireOwnership = (resourceModel, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const Model = require(`../models/${resourceModel}`);
            const resource = await Model.findById(req.params[paramName]);

            if (!resource) {
                return res.status(404).json({ error: 'Not found' });
            }

            if (resource.owner.toString() !== req.userId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };
};

module.exports = {
    requireAuth,
    loadUser,
    requireOwnership
};
