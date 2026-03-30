const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set. Google OAuth will be disabled.');
} else {
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"), null);

        // Find by googleId or email (handles cases where user registered manually first)
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

        if (!user) {
            // New user — create with 'user' role (can be updated later)
            user = await User.create({
                name: profile.displayName,
                email,
                googleId: profile.id,
                role: 'user',
            });
        } else if (!user.googleId) {
            // Existing email-password user — link their Google account
            user.googleId = profile.id;
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
} // end else (Google OAuth configured)

module.exports = passport;