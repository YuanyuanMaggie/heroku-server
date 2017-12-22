// nodejs runtime only support commonJS, no support ES6 import
const express = require('express'); 
require('./services/passport'); // only excute

const app = express();
const PORT = process.env.PORT || 5000;

require('./routes/authRoutes')(app);

app.get('/', (req, res) => {
    res.send({here: 'here'});
})

app.listen(PORT, () => {
    console.log(`Port listen at ${PORT}`);
})