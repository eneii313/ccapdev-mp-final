# DiscoverLAGUNA

## Description
DiscoverLAGUNA is a user-based travel bucket list website for the province of Laguna. Users can submit posts about the recommended things to do when visiting Laguna.<br /> <br />
Posts are categorized into three categories:
+ Must-Visits (places)
+ Must-Eats (food and resturants)
+ Must-Dos (activities and events)

All users are able to view posts and comments in the site. Users can also choose to see posts from a certain city/municipality. Registered users are able to like and create posts and comments.

## Author
Jonaviene DG. Capunitan - S13  <br />
CCAPDEV Machine Project

## Features
+ Upon visiting the homepage, users may see the 3-5 most liked posts in each category. Clicking a category title lets the user see all the uploaded posts under that category, where posts are sorted by likes. Clicking a post title will let the user view the post and the comments.
+ The navigation bar allows the user to see specific posts of a category or location. There is also a search bar where users can search for posts by keywords in the title or post tags. If a user is logged in, there are additional navigation options for their profile page, creating a new post and logging out.
+ A visitor must register if they want to post or comment. Here, a visitor must enter their username, email address, and password. Both the username and email address must be unique and cannot be changed afterwards. The user can also opt have an avatar and a short description of themselves.
+ After registering properly, the visitor will automatically be logged in. Upon logging in, the user can start posting and commenting. Users stay logged in even if they exit the website. The user may log out whenever they want through the navigation bar.
+ Each registered user has their own page which shows their profile publicly. On the same page, a visitor may see the user’s username, avatar and short description. They can also see the user’s posts and comments, which are sorted by the most recent.
+ A registered user may make a post. They must give a title for the post, the category it belongs to, the city/municipality it’s located in, the fee, and operating hours (if applicable). Posts are also required to have at least one photo and a text description.
Users can also include tags in their posts so that it can be easier to be searched by other users.
+ A logged in user can create, update, and delete their own posts and comments. They can also like a post or a comment (including their own) once.
+ A logged in user can update their profile picture and description.
+ A logged in user can delete his account. The user will be asked to enter his current password to permanently delete his account. The user’s profile page, posts and comments will be removed from the website.

## How To Run
Click [DiscoverLAGUNA](https://discoverlaguna.herokuapp.com/) to see the deployed web application in Heroku.

Local Version
1. Run Command Prompt
2. Go to the project file directory, then run the command 'npm install'
3. Run the command 'node app.js', then go to the indicated post of your local host server.

## Screenshots
### Home Page
![Home Page](https://github.com/eneii313/ccapdev-mp-final/blob/main/discoverLAGUNA.JPG?raw=true)

### Signup Page
![Signup Page](https://github.com/eneii313/ccapdev-mp-final/blob/main/dl_signup.JPG?raw=true)

### Sample Post Page
![Sample Post Page](https://github.com/eneii313/ccapdev-mp-final/blob/main/dl_post.jpg?raw=true)

## Sample Accounts
```text
Account 1: 
	Username: anneKulit 
	Password: pass1234 
	Email: annekulit02@gmail.com
```
```text
Account 2:
	Username: hot-springs-enjoyer
	Password: 102499
	Email: cdsantos@gmail.com
```
```text
Account 3:
	Username: StephanieFlores
	Password: 67At1n2*
	Email: steph.flores@yahoo.com
```
```text
Account 4:
	Username: luckyboi
	Password: star999
	Email: luckyboi99@gmail.com
```
```text
Account 5:
	username: Juanted
	Password: #4efr9K
	Email: juan.villamayor@email.com
```

## NPM Packages and Third Party Libraries
+ bcrypt 5.0.1
+ bcryptjs 2.4.3
+ connect-flash 0.1.1
+ cookie-parser 1.4.6
+ dotenv 16.0.1
+ express 4.18.1
+ express-fileupload 1.4.0
+ express-handlebars 6.0.6
+ express-session 1.17.3
+ hbs 4.2.0
+ moment 2.29.3
+ mongoose 6.4.0
+ node-cache 5.1.2
+ passport 0.6.0
+ passport-local 1.0.0

+ bootstrap-css 5.1.3
+ bootstrap-js 5.1.3
+ font-awesome 4.7.0
+ owl-carousel-css 2.3.4
+ owl-carousel-js 2.3.4
+ animate-css 4.1.1
+ jquery 3.6.0
+ popper 1.12.9
