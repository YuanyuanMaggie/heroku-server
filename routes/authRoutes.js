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
        passport.authenticate('google'),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/surveys');
        }
    );

    app.get('/api/logout', (req, res) => {
        req.logout(); // a function passport attach to req
        res.redirect('/');
    });
    
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    })
    
}