const express         = require('express'),
bodyParser            = require("body-parser"),
dotenv                = require('dotenv'),
mongoose              = require("mongoose"),
// flash                 = require("connect-flash"),
// passport              = require("passport"),
// LocalStrategy         = require("passport-local"),
// passportLocalMongoose = require("passport-local-mongoose"),
// cookieParser          = require('cookie-parser'),
User                  = require("./models/user"),
app                   = express();


dotenv.config();
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
// app.use(flash);
// app.use(require("express-session")({ secret: "web dev", resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
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
//     ));
// app.use(passport.authenticate('remember-me'));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());    
// app.use(function (req, res, next) {
//     res.locals.currentUser = req.user;
//     // res.locals.error = req.flash("error");
//     // res.locals.success = req.flash("success");
//     next();
// });

//**                    Main Routes

app.get("/", function(req, res){
    res.render('index');
});

app.get("/campgrounds", function (req, res) {
    res.render('campgrounds');
});

app.get("/userprofile", function (req, res) {
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
    // User.register(newUser, req.body.password, function (err, user) {
    //     if(err){
    //         req.flash("error", err.message);           
    //         return res.render("/signup");
    //     }
    //     passport.authenticate("local")(req, res, function () {
    //         res.redirect("/");
    //     });
    // });
});

app.get("/login", function name(req, res) {
    res.render("login");
});

// app.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
//     function(req, res, next) {
//         // issue a remember me cookie if the option was checked
//         if (!req.body.remember_me) { return next(); }

//         var token = utils.generateToken(64);
//         Token.save(token, { userId: req.user._id }, function(err) {
//             if (err) { return done(err); }
//             res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
//             return next();
//         });
//     }, function (req, res) {
//         res.redirect('/');
// });

// app.get("/logout", function (req, res) {
//     res.clearCookie('remember_me');
//     req.logout();
//     res.redirect('/');
// })

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
// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     // req.flash("error", "Please Login First!");
//     res.redirect("/login");
// };

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
