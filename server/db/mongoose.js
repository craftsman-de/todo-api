let mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
//mongoose.connect(keys.MONGO_URI);


module.exports = {mongoose};
