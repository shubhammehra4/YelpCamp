const express = require('express'),
router        = express.Router(),
passport      = require("passport"),
Campgrounds   = require('../models/campgrounds'),
User          = require("../models/user");

router.get("/signup", isLoggedOut, function (req, res) {
    res.render("signup");
});

router.post("/signup", isLoggedOut, function (req, res) {
    var newUser = new User({
        firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
        lastName : req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
        username : req.body.username,
        email    : req.body.email,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            if(err.code == 11000){
                req.flash("error", "Email already in use!");
                return res.redirect("/signup");
            } else{
                req.flash("error", err.message);
                return res.redirect("/signup");
            }
            
        }
        
        res.redirect("/login");
    });
});

// router.get("/auth/google", passport.authenticate("google", {
//     scope:['profile']
// }));

// router.get("/auth/google/callback", passport.authenticate("google"), function (req, res) {
//     // res.send("done!");
//     res.redirect('/');
// })

router.get("/login", isLoggedOut, function name(req, res) {
    res.render("login");
});

router.post("/login", isLoggedOut, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    successRedirect:'/campgrounds',
    successFlash: true,
    successFlash: "Welcome!"
    }),
    function(req, res) {
});

router.get("/logout", isLoggedIn, function (req, res) {
    // res.clearCookie('remember_me');
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect('/campgrounds');
});

router.get("/profile/@:uname", isLoggedIn, function (req, res) {
    Campgrounds.find({ author: {id: req.user._id, username: req.user.username}}, function (err, userCampgrounds) {
        if(err){
            console.log(err);
        } else {
            res.render("profile", {userCampgrounds: userCampgrounds});
        }
    })
});

router.post("/save", isLoggedIn, function (req, res) {
    Campgrounds.findById(req.body.campgroundId, function (err, campground) {
        if(err){
            console.log("Error");
        } else{
            var liked = {id: req.body.campgroundId ,name: campground.name};
            User.findByIdAndUpdate(req.user._id, {$addToSet: {likedCampgrounds: liked}}, function (err, user) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Saved");
                }
            });
        }
    });
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Logout First!");
    res.redirect("/campgrounds");  
};

module.exports = router;
