const express = require('express');

/* -- Controllers -- */
const controller = require('../controllers/controller');
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController')
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');

const app = express();

app.get(`/favicon.ico`, controller.getFavicon);

/* -- NAVIGATION -- */
// Home Page
app.get('/', controller.getHomePage);

//Login Page
app.get('/login', controller.getLoginPage);

//Signup Page
app.get('/signup', controller.getSignUpPage);


// CATEGORIES
app.get('/categories/:category', controller.getCategory);

// EXPLORE
app.get('/explore/:location', controller.getExplore);

// POSTS
app.get('/categories/:category/view/:postId', controller.getPost);

// SEARCH
app.get('/search', controller.getSearch);

/* -- VALIDATION -- */

// REGISTRATION FORM VALIDATION
app.get('/checkEmail', signupController.getCheckEmail);
app.get('/checkUsername', signupController.getCheckUsername);
app.post('/signup', signupController.getAddUser);

// CREATE ACCOUNT PROFILE
app.get('/success', signupController.getSuccessPage);
app.post('/addProfile', signupController.getAddProfile);

// USER PAGE
app.get('/users/:username', controller.getUserProfile);

// ACCOUNT SETTINGS
app.get('/users/:username/settings', loginController.getAccountSettings);
app.post('/updateProfile', loginController.getUpdateProfile);
app.post('/verifyPassword', loginController.getVerifyPassword);
app.post('/deleteAccount/:username', loginController.getDeleteAccount);

// LOGIN FORM VALIDATION
app.post('/login', loginController.getLogin);

// LOGOUT
app.get('/logout', loginController.getLogOut);

/* -- POSTS -- */

// CREATE POST
app.get('/users/:username/create-post', postController.getCreatePost);
app.post('/create-post', postController.getSubmitPost);

// EDIT POST
app.get('/:postId/edit', postController.getEditPost);
app.post('/:postId/update-post', postController.getSubmitUpdatePost);
app.post('/:postId/delete', postController.getDeletePost);

/* -- COMMENTS -- */

app.post('/comment', commentController.getAddComment);
app.post('/update-comment', commentController.getUpdateComment);
app.post('/delete-comment', commentController.getDeleteComment);

/* -- LIKES -- */
app.post('/like-post', likeController.getLikePost);
app.get('/check-like-post', likeController.getCheckLikePost);
app.post('/like-comment', likeController.getLikeComment);
app.get('/check-like-comment', likeController.getCheckLikeComment);

module.exports = app;