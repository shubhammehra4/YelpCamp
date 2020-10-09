const express         = require('express'),
router = express.Router(),
passport              = require("passport"),
User                  = require("../models/user");

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", function (req, res) {
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

// router.get("/auth/google", passport.authenticate("google", {
//     scope:['profile']
// }));

// router.get("/auth/google/callback", passport.authenticate("google"), function (req, res) {
//     // res.send("done!");
//     res.redirect('/');
// })

router.get("/login", function name(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    successRedirect:'/campgrounds',
    }),
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
    // res.redirect('/');
});

router.get("/logout", function (req, res) {
    // res.clearCookie('remember_me');
    req.logout();
    res.redirect('/');
});

router.get("/userprofile", isLoggedIn, function (req, res) {
    res.send(req.user.firstName + req.user.lastName);
});

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

module.exports = router;
