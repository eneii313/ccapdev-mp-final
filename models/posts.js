const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true
    },

    postAuthor: {
        type: String,
        required: true
    },

    postCategory: {
        type: String,
        required: true
    },

    postLocation: {
        type: String,
        required: true
    },

    postPricing: {
        minPrice: Number,
        maxPrice: Number
    },

    postTime: {
        startTime: String,
        endTime: String
    },

    postImages: {
        type: [String],
        required: true
    },

    postDate: {
        type: Date,
        default: Date.now,
    },

    isEdited: false,

    postDescription: {
        type: String,
        required: true
    },

    postTags: [String],

    // array of usernames
    postLikes: [String],

    postComments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}]

});

const Post = mongoose.model('posts', postSchema);
module.exports = Post;