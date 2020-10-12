const express         = require('express'),
bodyParser            = require("body-parser"),
dotenv                = require('dotenv'),
mongoose              = require("mongoose"),
flash                 = require("connect-flash"),
passport              = require("passport"),
LocalStrategy         = require("passport-local").Strategy,
passportLocalMongoose = require("passport-local-mongoose"),
// GoogleStrategy        = require("passport-google-oauth20"),
methodOverride        = require('method-override'),
User                  = require("./models/user"),
Campgrounds           =  require('./models/campgrounds'),
Comment               = require('./models/comment'),
indexRoutes           = require("./routes/index"),
campgroundsRoutes     = require("./routes/campground"),
authRoutes            = require("./routes/auth"),
// seedDB                = require('./seeds'),
app                   = express();



dotenv.config();
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(flash());
app.use(require("express-session")({ secret: "web dev", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new GoogleStrategy({
//         callbackURL: "/auth/google/callback",
//         clientID: process.env.clientID,
//         clientSecret: process.env.clientSecret
//     }, (accessToken, refreshToken, profile, done) => {
//         //callback 
//         console.log(profile);
//         User.findOne({googleid: profile.id}).then(function (existingUser) {
//             if(existingUser){
//                 done(null, existingUser);
//             } else{
//                 new User({
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     username: profile._json.email,
//                     email: profile._json.email,
//                     googleid: profile.id
//                 }).save().then((newUser)=> {
//                     // console.log(newUser);
//                     done(null, newUser);
//                 });
//             }
//         })        
//     })
// )
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(authRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);

//!                 DB
// seedDB();

/** 
 * TODO: 
 * TODO: Comments CRUD
 * TODO: password show func.
 * TODO: Make a profile page
 * TODO: add like functionality
 * TODO: show average of rating on campground 
*/


//**                    Port

app.listen(process.env.PORT, function () {
    console.log("Server is running!");
    console.log(`Your Port is ${process.env.PORT}`);
});
