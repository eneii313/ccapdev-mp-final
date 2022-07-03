const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "/images/avatar-default.jpg"
    },
    description: {
        type: String,
        default: ""
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },

});

const User = mongoose.model('users', userSchema);
module.exports = User;