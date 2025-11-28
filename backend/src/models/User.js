const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    airtableUserId: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    displayName: String,
    profilePicture: String,
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tokenExpiresAt: Date,
    lastLoginAt: Date
}, {
    timestamps: true
});

userSchema.methods.isTokenExpired = function () {
    return this.tokenExpiresAt < new Date();
};

userSchema.index({ airtableUserId: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
