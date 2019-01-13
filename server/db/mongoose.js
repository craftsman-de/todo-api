let mongoose = require('mongoose');
//let keys = require('../keys');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
//mongoose.connect(keys.MONGO_URI);


module.exports = {mongoose};
