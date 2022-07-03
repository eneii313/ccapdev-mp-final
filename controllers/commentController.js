const db = require('../models/db.js');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const ObjectId = require('mongoose').Types.ObjectId;

const commentController = {

    // Adds comment into the DB and appends it to the post
    // POST request '/comment'
    getAddComment: function(req, res) {
        
        var newComment = {
            cAuthor: res.locals.username,
            cProfilePic: res.locals.profilePic,
            cDate: new Date(),
            cDescription: req.body.cDescription,
            cPostId: req.body.cPostId,
        };

        db.findOne(Post, {_id: req.body.cPostId}, '', function(post) {
            if(post) {
                newComment.cPostTitle = post.postTitle;
                newComment.cPostCategory = post.postCategory;


                Comment.create(new Comment(newComment))
                .then(result => {
                    var data = result.toObject();
                    data.layout = false;
                    data.cloggedUser = data.cAuthor;

                    var commentId = ObjectId(result._id);

                    Post.updateOne({_id: req.body.cPostId}, {$push:{'postComments': commentId}}, function(err, result) {
                        if(err) console.log("Error in adding comment to post. " + err);
                    });

                    res.render('partials/post-comment-card', data, function(err, html) {
                        if (err) {
                            console.log("Error in rendering comment. " + err);
                            throw err;
                        }
                        res.send(html);
                    })
                })
                .catch(function (err) {
                    console.log("ERROR in adding new comment. " + err);
                    res.send(false);
                });
            }
        })
    },

    // Updates comment given by req.body.commentId
    // POST  request '/update-comment'
    getUpdateComment: function(req, res) {

        const commentId = req.body.commentId;
        const description = req.body.cDescription;

        Comment.updateOne({_id: commentId}, {cDescription: description, isEdited: true}, function(err, result) {
            if(err) {
                console.log("Error in updating comment. " + err);
                res.send(false);
            }
            else {
                res.send(true);
            }
        });

    },

    // deletes a comment given by req.body.commentId
    // POST  request '/delete-comment'
    getDeleteComment: function(req, res) {

        const commentId = req.body.commentId;

        Post.updateMany({}, {$pull:{'postComments': commentId}}, function(err, result) {
            if(err) console.log("Error in deleting this comment from associated post. " + err);
        });

        Comment.deleteOne({_id: commentId}, function(err, result) {
            if(err) {
                console.log(err);
                res.send(false);
            }
            else {
                console.log('Document deleted: ' + result.deletedCount);
                res.send(true);
            }
        });

    }

}

module.exports = commentController;