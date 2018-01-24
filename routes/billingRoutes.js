const keys = require('../config/keys');
const stripe = require('stripe')(keys.StripeSecretKey);
const requireAuth = require('../middlewares/requireAuth');

module.exports = (app) => {
    // url, middleware, handle request
    app.post('/api/stripe', requireAuth, async (req, res) => {
    
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5',
            source: req.body.id
        })

        req.user.credits += 5; // Magic here, just change the user object??
        const user = await req.user.save();
        res.send(user);
    })
}