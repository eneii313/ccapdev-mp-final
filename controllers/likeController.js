const db = require('../models/db.js');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const ObjectId = require('mongoose').Types.ObjectId;

const likeController = {

    // Checks if the user has liked the post
    // if true, add the user's name into the post's likes array
    // otherwise, remove it
    // POST request '/like-post'
    getLikePost: function (req, res) {

        var response = {
            loginURL: '/login'
        };
        
        if (!res.locals.loggedIn){
            response.loggedIn = false;
            res.send(response);
        }

        else {
            var postId = req.body.postId;

            Post.findOne({_id: postId, postLikes: res.locals.username}, function(err, result){
                if (err) res.status(404).json({error: err});

                else {
                    if (result == null) {
                        Post.updateOne({_id: postId}, {$push: {'postLikes': res.locals.username}})
                            .catch(err=> { res.status(404).json({error: err}) });
                    }
                    else {
                        Post.updateOne({_id: postId}, {$pull: {'postLikes': res.locals.username}})
                            .catch(err=> { res.status(404).json({error: err}) });
                    }
                }
            })

            response.loggedIn = true;
            res.send(response);
        }
        
    },

    // checks if the current user already liked the post
    // GET request '/check-like-post'
    getCheckLikePost: function (req, res) {

        const user = res.locals.username;
        const postId = req.query.postId;

        Post.findOne({_id: postId, postLikes: user}, function(err, result){
            if (err) res.status(404).json({error: err})
            else {
                if (result == null) 
                    res.send(false); 

                else res.send(result);
            }
        })
    },

    // Checks if the user has liked the comment
    // if true, add the user's name into the comment's likes array
    // otherwise, remove it
    // POST request '/like-comment'
    getLikeComment: function (req, res) {

        var response = {
            loginURL: '/login'
        };
        
        if (!res.locals.loggedIn){
            response.loggedIn = false;
            res.send(response);
        }

        else {
            var cId = req.body.cId;

            Comment.findOne({_id: cId, cLikes: res.locals.username}, function(err, result){
                if (err) res.status(404).json({error: err});

                else {
                    if (result == null) {
                        Comment.updateOne({_id: cId}, {$push: {'cLikes': res.locals.username}})
                            .catch(err=> { res.status(404).json({error: err}) });
                    }
                    else {
                        Comment.updateOne({_id: cId}, {$pull: {'cLikes': res.locals.username}})
                            .catch(err=> { res.status(404).json({error: err}) });
                    }
                }
            })

            response.loggedIn = true;
            res.send(response);
        }
        
    },

    // checks if the current user already liked the comment
    // GET request '/check-like-comment'
    getCheckLikeComment: function (req, res) {

        const user = res.locals.username;
        const cId = req.query.cId;

        Comment.findOne({_id: cId, cLikes: user}, function(err, result){
            if (err) res.status(404).json({error: err})
            else {
                if (result == null) 
                    res.send(false); 

                else res.send(result);
            }
        })

        res.render('error');
    }
}

module.exports = likeController;