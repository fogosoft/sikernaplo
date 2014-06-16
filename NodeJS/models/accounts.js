var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    alias: String,
    password: String,
    role: String,
    email: String,
    provider: String,
    provider_id: String,
    provider_token: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);