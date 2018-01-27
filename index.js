// nodejs runtime only support commonJS, no support ES6 import
const express = require('express'); 
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser'); // will be req.body
require('./models/User');
require('./services/passport'); // only excute
const PORT = process.env.PORT || 5000;

mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys:[keys.cookieKey]
}))

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    // server up for main.js and main.css
    app.use(express.static('client/build'));
    const path = require('path');
    // if don't understand the route, give the index html file
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

// app.get('/', (req, res) => {
//     res.send({here: 'here'});
// })

app.listen(PORT, () => {
    console.log(`Port listen at ${PORT}`);
})