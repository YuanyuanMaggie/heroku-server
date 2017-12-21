// nodejs runtime only support commonJS, no support ES6 import
const express = require('express'); 
const app = express();
const PORT = process.env.port || 5000;

app.get('/', (req, res) => {
    res.send({here: 'here'});
})

app.listen(PORT, () => {
    console.log(`Port listen at ${PORT}`);
})