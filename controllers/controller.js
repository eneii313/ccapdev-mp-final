const db = require('../models/db.js');
const User = require('../models/users');
const Post = require('../models/posts');
const Comment = require('../models/comments');

// Navigation Controller
// For pages that can be viewed by all users
const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },

    // Home Page
    getHomePage: async function(req, res) {
        var params = {
            loggedIn : res.locals.loggedIn,
            displayFooter : true,
        }

        var posts = {
            mustVisits: [],
            mustEats: [],
            mustDos: []
        }


        async function findTop5(category, callback){
            await Post.aggregate([
                {$match: {postCategory: category}},
                {$addFields: {postLikesCount: {$size: "$postLikes"}}},
                {$sort: {postLikesCount: -1} },
                {$limit: 5}
            ], function(err, result) {
                if(err) return callback(false);
                return callback(result);
            })
        }

        // Must-Visits
        findTop5("must-visits", function(result) {
            if(result){

                for (var i = 0; i < result.length; i++)
                    posts.mustVisits.push(result[i]);

                console.log("Fetching must visits..." + posts.mustVisits.length);
            }
        })


        .then (
            // Must-Eats
            findTop5("must-eats", function(result) {
                if(result){
                    for (var i = 0; i < result.length; i++)
                        posts.mustEats.push(result[i]);
                    console.log("Fetching must eats..." + posts.mustEats.length);
                }
            })
        )

        .then (
            // Must-Dos
            findTop5("must-dos", function(result) {
                if(result){
                    for (var i = 0; i < result.length; i++)
                        posts.mustDos.push(result[i]);
                        console.log("Fetching must dos..." + posts.mustDos.length);
                }
            })
        )
        

        .then(function() {
            console.log("!!!!!!! RENDERING HOME PAGE...");
            params.posts = posts;    
            res.render('home', params);
        })

    },

    // About Page
    getAboutPage: function(req, res) {

        var params = {
            displayFooter : true,
        }

        res.render('about', params);

    },

    // Login Page
    // If a user is already logged in, redirect to home page
    getLoginPage: function(req, res) {

        if (res.locals.loggedIn)
            res.redirect('/');
        
        else {
            var params = {
                displayFooter : false,
                nameError : req.query.nameError,
                passError: req.query.passError
            }
    
            res.render('login', params);

        }

    },

    // Sign Up Page
    // If a user is already logged in, redirect to home page 
    getSignUpPage: function(req, res) {

        if (res.locals.loggedIn)
            res.redirect('/');
        
        else {
            var displayFooter = false;
            res.render('signup', {displayFooter});
        }
    },

    // Show User Profile
    // If user was not found, display as such
    // GET request '/users/:username'
    getUserProfile: function(req, res) {
        
        var username = req.params.username;

        var params = {
            displayFooter: true,
            loggedIn: res.locals.loggedIn
        }

        db.findOne(User, {username: username}, '', function(result){

            if (result){
                params.user = result.toObject();

                // check if this user own the account profile
                if (res.locals.username == result.username)
                    params.loggedUser = true;

                // check if this user has a description
                if (result.description == "")
                    params.noDesc = true;

                // find user's posts
                function findPosts(username, callback){
                    Post.aggregate([
                        {$match: {postAuthor: username}},
                        {$sort: {postDate: -1} },
                    ], function(err, result) {
                        if(err) return callback(false);
                        return callback(result);
                    })
                }

                // find user's comments
                function findComments(username, callback){
                    Comment.aggregate([
                        {$match: {cAuthor: username}},
                        {$sort: {cDate: -1} },
                    ], function(err, result) {
                        if(err) {
                            console.log("Error in fetching comments of this post");
                            console.log(err);
                            return callback(false);
                        }
                        return callback(result);
                    })
                }

                findPosts(username, function (result) {
                    if (result) {
                        params.posts = result;

                        // Add Comments into params
                        findComments(username, function(result) {
                            if (result) {
                                
                                params.comments = result;

                                res.render('users', params);
                            }
                        })  
                        
                    }
                });

            }

            else {
                res.render('error',  {error: "User " + username + " doesn't exist."});
            }
     
        });
    },

    // Views the selected category and the posts associated w/ it
    // GET request '/categories/:category'
    getCategory : function(req, res) {

        var params = {
            loggedIn: res.locals.loggedIn,
            displayFooter: false,
            category: req.params.category
        }

        function findPosts(category, callback){
            Post.aggregate([
                {$match: {postCategory: category}},
                {$addFields: {postLikesCount: {$size: "$postLikes"}}},
                {$sort: {postLikesCount: -1} },
            ], function(err, result) {
                if(err) return callback(false);
                return callback(result);
            })
        }

        var posts = [];

        findPosts(params.category, function(result) {
            if(result){
                for (var i = 0; i < result.length; i++)
                    posts.push(result[i]);
                
                if (result.length > 3)
                    params.displayFooter = true;

                params.posts = posts;

                res.render('category', params);
            }
        });
    },

    // Views the selected location and the posts associated w/ it
    // GET request '/explore/:location'
    getExplore: function(req, res) {
        
        var params = {
            loggedIn: res.locals.loggedIn,
            displayFooter: true,
            location: req.params.location
        }

        function findPosts(location, callback){
            Post.aggregate([
                {$match: {postLocation: location}},
                {$addFields: {postLikesCount: {$size: "$postLikes"}}},
                {$sort: {postLikesCount: -1} },
            ], function(err, result) {
                if(err) return callback(false);
                return callback(result);
            })
        }

        var posts = [];

        findPosts(params.location, function(result) {
            if(result){
                for (var i = 0; i < result.length; i++)
                    posts.push(result[i]);
                
                if (result.length > 3)
                    params.displayFooter = true;

                params.posts = posts;

                res.render('explore', params);
            }
        });

    },

    // Views the clicked post
    // GET request '/categories/:category/view/:postId'
    getPost: function(req, res) {

        var params = {
            loggedIn: res.locals.loggedIn,
            displayFooter: true,
        }

        if (res.locals.loggedIn) // cloggedUser == for comments
            params.cloggedUser = res.locals.username;

        function findComments(postId, callback){
            Comment.aggregate([
                {$match: {cPostId: postId}},
                {$sort: {cDate: -1} },
            ], function(err, result) {
                if(err) {
                    console.log("Error in fetching comments of this post");
                    console.log(err);
                    return callback(false);
                }
                return callback(result);
            })
        }
        

        db.findOne(Post, {_id: req.params.postId}, '', function(postResult){

            if (postResult){

                params.post = postResult.toObject();

                // check if this user own the account profile
                if (res.locals.username == params.post.postAuthor)
                    params.loggedUser = true;
                
                // get all comments
                findComments(postResult._id.toString(), function(result) {
                    if (result) {
                        params.comments = result;

                        res.render('post', params);
                    }   
                })
            }

            else {
                res.render('error', {error: "Unable to find post."});
            }
     
        });
    
    },

    // views search results
    // GET request '/search'
    getSearch: function(req, res) {

        if (req.query.term != null) {
            const term = req.query.term.trim();

            if (term.length == 0) {
                res.redirect('/');
            }
    
            else {
                var params = {
                    loggedIn: res.locals.loggedIn,
                    displayFooter: false,
                    term: term
                }
                
                var regex = new RegExp('.*'+term+'.*', 'i'); //exact term in the string
    
                // default: latest upload
                Post.find({$or:[
                    {postTitle: {$regex: regex}},
                    {postTags: {$regex: regex}}
                ]}).sort({postDate: -1}).exec((err, posts) => {
                    if (err) console.log(err);
        
                    var postArray = [];
        
                    posts.forEach(function(post){
                        postArray.push(post.toObject());
                        
                    })
        
                    params.posts = postArray;
                    res.render('search', params);
        
                });
            }
        }
        else res.render('error', {error: "Search term not provided"});
    }

}

module.exports = controller;