require('dotenv').config();

async function Test (req, res) {
    res.send('Hello !');
}

module.exports = {
    Test,
}