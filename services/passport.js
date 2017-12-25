const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, cb)=>{
    cb(null, user.id);
})

passport.deserializeUser((id, cb) => {
    User.findById(id)
    .then(user => {
        cb(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        clientID: keys.GOOGLE_CLIENT_ID,
        clientSecret: keys.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, cb) => {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return cb(null, existingUser);
        }
        const user = await new User({ googleId: profile.id }).save();
        cb(null, user);
    }
));