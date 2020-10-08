const express         = require('express'),
bodyParser            = require("body-parser"),
dotenv                = require('dotenv'),
mongoose              = require("mongoose"),
// flash                 = require("connect-flash"),
passport              = require("passport"),
LocalStrategy         = require("passport-local").Strategy,
// RememberMeStrategy    = require('passport-remember-me').Strategy,
passportLocalMongoose = require("passport-local-mongoose"),
cookieParser          = require('cookie-parser'),
User                  = require("./models/user"),
Campgrounds           =  require('./models/campgrounds'),
Comment               = require('./models/comment');
// seedDB                = require('./seeds'),
app                   = express();


dotenv.config();
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(flash);
app.use(require("express-session")({ secret: "web dev", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new RememberMeStrategy(
//     function(token, done) {
//         Token.consume(token, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         return done(null, user);
//         });
//     },
//     function(user, done) {
//         var token = utils.generateToken(64);
//         Token.save(token, { userId: user.id }, function(err) {
//         if (err) { return done(err); }
//         return done(null, token);
//         });
//     }
// ));
// app.use(passport.authenticate('remember-me'));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
//     // res.locals.error = req.flash("error");
//     // res.locals.success = req.flash("success");
    next();
});

// seedDB();

//**                    Main Routes

app.get("/", function(req, res){
    res.render('index');
});

//**                    Campgrounds

app.get("/campgrounds", function (req, res) {
    Campgrounds.find({}, function (err, allcampgrounds) {
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds',{campgrounds: allcampgrounds});
        }
    })
    
});

app.get("/campgrounds/new", function (req, res) {
    res.render('campgroundNew');
});

app.post("/campgrounds/new", function (req, res) {
    var newCampground = new Campgrounds({
        name: req.body.name,
        coverImage: req.body.image,
        description: req.body.description
    });
    Campgrounds.create(newCampground, function (err, msg) {
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
});

app.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
        } else{
            res.render("campgroundShow", {campground: foundCampground});
        }
    });
});

app.post("/campground/:id/comment", function (req, res) {
    Campgrounds.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else{
            var newComment = {
                author: "Jonas",
                text: req.body.comment,
            }
            Comment.create(newComment, function (err, comment) {
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                }
            })
        }
    })
})

app.get("/userprofile", isLoggedIn, function (req, res) {
    res.send(req.user.firstName + req.user.lastName);
})

//**                    Authentication

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", function (req, res) {
    var newUser = new User({
        firstName: req.body.firstName,
        lastName : req.body.lastName,
        username : req.body.username,
        email    : req.body.email,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            // req.flash("error", err.message);           
            return res.render("/signup");
        }
        // passport.authenticate("local")(req, res, function () {
        res.redirect("/login");
        // });
    });
});

app.get("/login", function name(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    // function(req, res, next) {
    // // Issue a remember me cookie if the option was checked
    // if (!req.body.remember_me) { return next(); }
    
    // issueToken(req.user, function(err, token) {
    //     if (err) { return next(err); }
    //     res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
    //     return next();
    // });
    // },
    function(req, res) {
    res.redirect('/');
});

app.get("/logout", function (req, res) {
    res.clearCookie('remember_me');
    req.logout();
    res.redirect('/');
})

//**                    Misc

app.get("/aboutus", function (req, res) {
    res.send("Hello");
});

app.get("/resources", function (req, res) {
    res.send("Hello");
});

app.get("*", function (req, res) {
    res.send("Return to home nothing here");
});

//**                    Midllewares

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please Login First!");
    res.redirect("/login");
};

// function isLoggedOut(req, res, next) {
//     if(!req.isAuthenticated()){
//         return next();
//     }
//     // req.flash("error", "Please Logout First!");
//     res.redirect("/");  
// };


//**                    Port

app.listen(process.env.PORT, function () {
    console.log("Server is running!");
    console.log(`Your Port is ${process.env.PORT}`);
});
