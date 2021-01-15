const mongoose = require('mongoose');
const { mongodb_uri } = require('../token.json');

module.exports = async () => {
    await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    return mongoose;
}