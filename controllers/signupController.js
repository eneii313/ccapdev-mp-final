const bcrypt = require('bcryptjs');
const path = require('path');

const db = require('../models/db.js');
const User = require('../models/users');

const signupController = {

    // Check if the email already exists
    // GET request '/checkEmail'
    getCheckEmail: function(req, res){
        var email = req.query.email;

        db.findOne(User, {email: email}, '', function(result){
            if(result)
                res.send(result);
            else res.render('error');
        });
    },

    // Check if the username already exists
    // GET request '/checkUsername'
    getCheckUsername: function (req, res) {
        var username = req.query.username;

        db.findOne(User, {username: username}, '', function(result){
            if (result)
                res.send(result);
            else res.render('error');
        });
   },

   // adds the user into the database
   // POST request '/signup'
   getAddUser: function(req, res) {
        
        const newUser = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            dateJoined: new Date()
        });

        var confirmPass = req.body.confirmPass;

        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;

            //Save user into the usersDB
            //if successful, the new user will be logged in and redirected to the '/success' page
            // where the user can finish creating their account profile
            db.insertOne(User, newUser, function(flag) {
                if (flag) {
                    
                    db.findOne(User, {username: newUser.username}, '', function(result){

                        if (result){
                            req.login(result, function(err) {
                                if (err) { return next(err)};
                                
                                return res.redirect('/success?username=' + newUser.username);
                            })
                        }
                        else res.render('error',  {error: "CANNOT FIND USER"});
                 
                    });     
                }
            });
        }));
        
   },

    // Create Account Profile
    // GET request '/success'
    getSuccessPage: function(req, res) {

        var username = req.query.username;

        if (!res.locals.loggedIn || (res.locals.loggedIn && username != res.locals.username))
            res.redirect('/');
        
        else {
            db.findOne(User, {username: username}, '', function(result){

                if (result){
                    req.login(result, function(err) {
                        if (err) { return next(err)};
    
                        var params = {
                            loggedIn : true,
                            displayFooter: false,
                            username: result.username,
                            email: result.email,
                            profilePic: result.profilePic,
                            dateJoined: result.dateJoined
                        }
        
                        return res.render('success', params);
                    })
                }
                else res.render('error',  {error: "CANNOT FIND USER"});
         
            });
        }

    },

    // adds profile picture and profile description
    // then redirects user to the home page
    // POST request '/addProfile'
    getAddProfile: function(req, res) {
                
        var username = req.body.username;
        var desc = req.body.desc;

        
        // if an image is chosen, upload profilePic
        if (req.files){
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

    }
}

module.exports = signupController;