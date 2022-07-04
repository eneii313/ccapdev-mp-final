const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const passport = require('passport');

const db = require('../models/db.js');
const User = require('../models/users');
const Post = require('../models/posts');
const Comment = require('../models/comments');

// ACCOUNT Controller
const loginController = {

    // checks if the login form is valid using passport
    // if successful, the user will be logged in
    // POST request '/login'
    getLogin: function(req, res, next) {
        
        passport.authenticate('local', function(err, user, info) {
            //failureRedirect
            if(!user) {
                var params = {
                    username: req.body.username,
                    password: req.body.password,
                    nameError: info.nameError,
                    passError: info.passError
                }
                res.render('login', params);
            }

            //successRedirect
            else {
                req.login(user, function(err) {
                    if(err) { return next(err); }
                    return res.redirect('/');
                })
            }
        }) (req, res, next);
    },

    
    // logs the user out
    // GET request '/logout'
    getLogOut: function(req, res) {
        if (req.session) {
            req.logout(function (err) {
                if (err) {return next(err); }
                req.session.destroy();
                res.redirect('/');
            }); 
        }
    },

    // opens account settings
    // if the user does not own this account, redirect to home page
    // GET request '/users/:username/settings'
    getAccountSettings: function(req, res) {

        var username = req.params.username;

        if (!res.locals.loggedIn)
            res.redirect('/');

        else if (res.locals.username != username)
            res.redirect('/');

        else {

            db.findOne(User, {username: username}, '', function(result){

                if (result){
                    var params = {
                        displayFooter: false,
                        loggedIn: true,
                        user : result.toObject()
                    }
                    
                    res.render('settings', params);
                }
    
                else {
                    console.log("Error in finding username: " + username);
                }
         
            });
        }
    },

    // Updates user profile
    // POST request '/updateProfile'
    getUpdateProfile: function(req, res) {
        
        var username = req.body.username;
        var desc = req.body.description;

        // if an image is chosen, upload profilePic
        if (req.files){

            // delete old profilePic (provided it is not the default one)
            User.findOne({username: username}, 'profilePic', function(err, result) {
                var image = result.profilePic;
                var imagePath = path.join(__dirname, '../public', image);
                if (image != '/images/avatar-default.jpg'){
                    fs.unlink(imagePath, (err) => {
                        if(err) console.log("Error in deleting this account's image. " + err);
                    });
                }
            });

            const image = req.files.image;

            var fileName = new Date().getTime() + "_" + image.name;

            image.mv(path.resolve(__dirname, '../public/images', fileName), (error) => {
                if (error)
                    res.send("ERROR in uploading image: " + error);
                User.updateOne({username: username}, {
                        profilePic: '/images/'+ fileName,
                        description: desc
                }, function(err) {
                    if(err) throw err;
                    res.redirect('/users/' + username);
                })               
            });
        }
        else {
            User.updateOne({username: username}, {description: desc}, function(error, result) {
                if (error) throw error;

                res.redirect('/users/' + username);
            });
        }
    },


    // Logs out the user and deletes the account from the database
    // POST request '/deleteAccount/:username'
    getDeleteAccount: function(req, res) {

        // TO DO: proper error message
        if (!res.locals.loggedIn || (req.params.username != res.locals.username))
            res.redirect('/');

        else {
            // log out account
            req.logout(function (err) {
                if (err) {return next(err); }
                req.session.destroy();
            });


            db.findOne(User, {username: req.params.username}, '', function(result){
                if (result) {
                    // delete image
                    var image = result.profilePic;
                    var imagePath = path.join(__dirname, '../public', image);

                    if (image != '/images/avatar-default.jpg'){
                        fs.unlink(imagePath, (err) => {
                            if(err) console.log("Error in deleting this account's image. " + err);
                        });
    
                    }

                    // delete all image posts
                    db.findMany(Post, {postAuthor: result.username}, 'postImages', function(result){
                            
                        if (result) {
                            for(var i = 0; i < result.length; i++) {
                                for (var j = 0; j < result[i].postImages.length; j++){
                                    var imagePath = path.join(__dirname, '../public', result[i].postImages[j].toString());
                                    fs.unlink(imagePath, (err) => {
                                        if(err) console.log("Error in deleting this account's image. " + err);
                                    });
                                }  
                            }
                        }
                    })

                    // delete all posts of this user
                    db.deleteMany(Post, {postAuthor: result.username}, function(result) {
                        if(result) console.log("Deleted posts");

                        else console.log("Error in deleting posts");
                    });

                    // delete all post likes of this user
                    db.updateMany(Post, {}, {$pull: {'postLikes': result.username}}, function(result) {
                        if(result) console.log("Successfully removed likes from posts");
                    });

                    // delete all comment likes of this user
                    db.updateMany(Comment, {}, {$pull: {'cLikes': result.username}}, function(result) {
                        if(result) console.log("Successfully removed likes from comments");
                    });
                        
                    // delete all comments of this user
                    db.findMany(Comment, {cAuthor: result.username}, '_id', function(result) {
                        var comments = result;
                        console.log("Comments result: " + comments);
                        db.updateMany(Post, {}, {$pull: {'postComments': {$in: comments}}}, function(result) {
                            if(result) console.log("Successfully removed commentIds from posts");
                        });
                    })

                    db.deleteMany(Comment, {cAuthor: result.username}, function(result) {
                        if (result) console.log("Deleted comments");
                        else console.log("Error in deleting comments");
                    })
                }
            })
            
            // delete account
            User.deleteOne({username: req.params.username}, function(err, result){
                if(err) {
                    res.send("Cannot delete user");
                    throw err;
                }
                console.log('Document deleted: ' + result.deletedCount);
                res.redirect('/');
            })
        }
    },
    
    // checks if the password is correct
    // If password is correct, send null. Otherwise, return the error 'password mismatch'
    // POST request '/verifyPassword'
    getVerifyPassword: function(req, res, next) {

        var username = req.body.username;

        db.findOne(User, {username: username}, '', function(result){

            if (result){

                passport.authenticate('local', function(err, user, info) {
                    //failureRedirect
                    if(!user) {
                        res.render('error', {error: info.passError})
                    }
                    else res.send(null);
                }) (req, res, next);
            }
            
            else {
                res.render('error',  {error: "User " + username + " doesn't exist."});
            }
     
        });
    },


}

module.exports = loginController;