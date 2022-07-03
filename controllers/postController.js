const path = require('path');
const fs = require('fs');

const db = require('../models/db.js');
const User = require('../models/users');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const controller = require('./controller.js');


const postController = {

    // Renders the create post page
    // GET request 'users/:username/create-post'
    getCreatePost: function(req, res) {

        if (!res.locals.loggedIn || (req.params.username != res.locals.username))
           res.redirect('/'); 
            
        else {
            var params = {
                displayFooter: false,
                loggedIn: res.locals.loggedIn,
                username: res.locals.username
            }
            
            res.render('create-post', params);
        }
    },

    // Adds the post into the DB
    // POST request '/create-post'
    getSubmitPost: function(req, res){

        var newPost = new Post({
            postTitle: req.body.postTitle,
            postAuthor: res.locals.username,
            postCategory: req.body.postCategory,
            postDescription: req.body.postDescription,
            postLocation: req.body.postLocation,
            postDate: new Date(),
            postTags: req.body.postTags,
        });

        if (req.body.checkPrice == 'on') {
            newPost.postPricing.minPrice = req.body.minPrice;

            if (req.body.maxPrice != "")
                newPost.postPricing.maxPrice = req.body.maxPrice;
        }

        if (req.body.checkTime == 'on') {
            newPost.postTime.startTime = req.body.startTime;

            if (req.body.endTime != "")
                newPost.postTime.endTime = req.body.endTime;
        }

        if (req.files){

            const images = [].concat(req.files.postImages);

            for (var i = 0; i < images.length; i++){
                var imageName = new Date().getTime() + "_" + images[i].name;
                images[i].mv(path.resolve(__dirname, '../public/images', imageName), (error) => {
                    if (error)
                        res.render('error', {error: "ERROR in uploading image: " + error});   
                });
                newPost.postImages.push('/images/' + imageName);
            }

        }

        Post.create(newPost)
            .then(result => {
                res.redirect('/categories/' + result.postCategory + '/view/' + result._id);
            })
            .catch(function (err) {
                res.render('error', {error: "ERROR in adding new post: " + error});
        });

    
    },

    // Renders the edit post page
    // GET request ':postId/edit'
    getEditPost: function(req, res) {   

        var params = {
            loggedIn: res.locals.loggedIn,
            displayFooter: false
        }

        if (!res.locals.loggedIn)
            res.redirect('/');

        else {
            var postId = req.params.postId;
            db.findOne(Post, {_id: postId}, '', function(postResult){
                if(postResult) {
                    if (postResult.postAuthor != res.locals.username)
                        res.redirect('/');
    
                    else {
                        params.post = postResult.toObject();
                        res.render('update-post', params);
                    }
    
                }
                else res.send("Post was not found. Post Id: " + req.params.postId);
            })

        }
    },

    // Updates the post
    // POST request '/:postId/update-post'
    getSubmitUpdatePost: function(req, res){

        var postId = req.params.postId;

        var tempPost = {
            postTitle: req.body.postTitle,
            postCategory: req.body.postCategory,
            postDescription: req.body.postDescription,
            postLocation: req.body.postLocation,
            postTags: req.body.postTags,
            isEdited: true,
            postPricing: {minPrice: "", maxPrice: ""},
            postTime: {startTime: "", endTime: ""}
        };

        if (req.body.checkPrice == 'on') {
            tempPost.postPricing.minPrice = req.body.minPrice;

            if (req.body.maxPrice != "")
                tempPost.postPricing.maxPrice = req.body.maxPrice;

        }

        if (req.body.checkTime == 'on') {
            tempPost.postTime.startTime = req.body.startTime;

            if (req.body.endTime != "")
                tempPost.postTime.endTime = req.body.endTime;

        }


        // Upload images
        if (req.files){
            const images = [].concat(req.files.postImages);

            for (var i = 0; i < images.length; i++){
                var imageName = new Date().getTime() + "_" + images[i].name;
                images[i].mv(path.resolve(__dirname, '../public/images', imageName), (error) => {
                    if (error)
                        res.send("ERROR in uploading image: " + error);
                });

                Post.updateOne({_id: postId}, {$push: {'postImages': '/images/' + imageName} }, function(error, result) {
                    if (error) {
                        console.log("Error in uploading new images. " + error);
                    }
                });
            }
        }

        var deletedImages = [].concat(req.body.deleteImages);

        if (deletedImages != "") {
            // Delete image files
            for (var i = 0; i < deletedImages.length; i++) {
                var imagePath = path.join(__dirname, '../public', deletedImages[i].toString());
                fs.unlink(imagePath, (err) => {
                    if(err) console.log("Error in deleting this post's image. " + err);
                });

                Post.updateOne({_id: postId}, {$pull: {'postImages': deletedImages[i]}}, function(error, result) {
                    if (error) {
                        console.log("Error in deleting old images");
                    }
                });
            }
        }

        Post.updateOne({_id: postId}, tempPost, function(error, result) {
            if (error) {
                console.log("Error in updating post");
                res.send(error);
            }
            else {
                console.log("Post successfully updated");
                res.redirect('/categories/'+tempPost.postCategory+'/view/'+postId);
            }
        });
    
    },

    // deletes the post of the given postId
    // redirects to the post's author's profile
    // POST request ':postId/delete'
    getDeletePost: function(req, res) {

        
        db.findOne(Post, {_id: req.params.postId}, '', function(result) {
            if(result) {

                // delete all the images related to this post
                var images = result.postImages;

                for(var i = 0; i < images.length; i++){
                    var imagePath = path.join(__dirname, '../public', images[i]);
                    fs.unlink(imagePath, (err) => {
                        if(err) console.log("Error in deleting this post's image. " + err);
                    });
                }

                // delete all the comments in this post
                db.deleteMany(Comment, {cPostId: result._id.toString()}, function(result){
                    if(result)
                        console.log("Successfully deleted comments of this post");
                })
            }
        });


        Post.deleteOne({_id: req.params.postId}, function(err, result){
            if(err) {
                res.send("Deleting post failed; post not found." + err);
            }

            console.log('Document deleted: ' + result.deletedCount);
            res.redirect('/users/' + res.locals.username);
        })


    }

}

module.exports = postController;