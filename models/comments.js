const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    cAuthor: {
        type: String,
        required: true
    },

    cProfilePic: {
        type: String,
        required: true
    },

    cDate: {
        type: Date,
        default: Date.now,
    },

    isEdited: false,

    cDescription: {
        type: String,
        required: true
    },

    // array of usernames
    cLikes: [String],

    cPostId: {
        type: String,
        required: true
    },

    cPostTitle: {
        type: String,
        required: true
    },

    cPostCategory: {
        type: String,
        required: true
    },

});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;