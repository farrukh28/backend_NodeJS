const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// automatically add username and password to userSchema
userSchema.plugin(passportLocalMongoose);

var Users = mongoose.model('user', userSchema);

module.exports = Users;