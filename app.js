const express = require('express');
const { engine } = require('express-handlebars');
const moment = require('moment'); //for date formatting
const fileUpload = require("express-fileupload");

const cookieParser = require('cookie-parser');
const session = require('express-session'); 
const passport = require('passport');

const routes = require('./routes/routes.js');

const db = require('./models/db.js');

// Passport config
require('./controllers/passport.js')(passport);

// Database Models
const userDB = require('./models/users');
const postDB = require('./models/posts');
const commentDB = require('./models/comments');


const app = express();
const port = process.env.PORT || 3000;

//connect to Mongo
db.connect();

// Express Session
const cookieExpirationDate = new Date();
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + 365);

app.use(cookieParser("session"));
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false,
        expires: cookieExpirationDate,
      }
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    if(req.user) {
        res.locals.profilePic = req.user.profilePic;
        res.locals.username = req.user.username;
    }
    next();
})

// Static Files
app.use(express.static('public'));

// Body Parser & File Uploads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());


// Handlebars
app.set('view engine', 'hbs');
app.engine('hbs', engine ({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        section(name, options) {
            if (!this._sections)
                this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        'isloggedUser' : function(user, author, options) {
            if (user == author)
                return options.fn(this);
            return options.inverse(this);
        },
        'trimDate': function(dateTime, format) {
            //parse date OBj to show just date
            var mmt = moment(dateTime);
            return mmt.format(format);
        },
        'trimName' : function(username) {
            if (username.length > 8)
                return username.substring(0, 4) + "...";
            else return username;
        },
        'trimDesc' : function(description) {
            if (description.length > 340)
                return description.substring(0, 337) + "...";
            else return description;
        },
        'getLocName' : function(locationRef) {
            switch(locationRef) {
                case "alaminos": return "Alaminos";
                case "bay": return "Bay";
                case "binan": return "Biñan";
                case "cabuyao": return "Cabuyao";
                case "calamba": return "Calamba";
                case "calauan": return "Calauan";
                case "cavinti": return "Cavinti";
                case "famy": return "Famy";
                case "kalayaan": return "Kalayaan";
                case "liliw": return "Liliw";
                case "los-banos": return "Los Baños";
                case "luisiana": return "Luisiana";
                case "lumban": return "Lumban";
                case "mabitac": return "Mabitac";
                case "magdalena": return "Magdalena";
                case "majayjay": return "Majayjay";
                case "nagcarlan": return "Nagcarlan";
                case "paete": return "Paete";
                case "pagsanjan": return "Pagsanjan";
                case "pakil": return "Pakil";
                case "pangil": return "Pangil";
                case "pila": return "Pila";
                case "rizal": return "Rizal";
                case "san-pablo": return "San Pablo";
                case "san-pedro": return "San Pedro";
                case "santa-cruz": return "Santa Cruz";
                case "santa-maria": return "Santa Maria";
                case "santa-rosa": return "Santa Rosa";
                case "siniloan": return "Siniloan";
                case "victoria": return "Victoria";
            }
        }
    }
}));

// Import Routes
app.use('/', routes);

app.use(function (req, res) {
    res.render('error');
});

app.listen(port, function() {
    console.log("Listening at port " + port + "...");
})


