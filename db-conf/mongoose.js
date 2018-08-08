var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://dbuser:Cazzo1234@ds159110.mlab.com:59110/heroku_rjlq6v5s' || 'mongodb://localhost:27017/nova');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nova',{ useNewUrlParser: true });

module.exports = {mongoose};

