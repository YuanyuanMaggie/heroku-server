const passport = require('passport');

// return a function can use directly
module.exports = (app) => {
    app.get(
        '/auth/google',
        passport.authenticate('google', { 
            scope: ['profile', 'email'] 
        })
    );
    
    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        }
    );
}