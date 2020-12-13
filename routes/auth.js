const express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    Campgrounds = require('../models/campgrounds'),
    User = require("../models/user");

router.get("/signup", isLoggedOut, (_req, res) => {
    res.render("signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
    var newUser = new User({
        firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
        lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
        username: req.body.username,
        email: req.body.email,
    });
    User.register(newUser, req.body.password, (err, _user) => {
        if (err) {
            if (err.code == 11000) {
                req.flash("error", "Email already in use!");
                return res.redirect("/signup");
            } else {
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

router.get("/login", isLoggedOut, (_req, res) => {
    res.render("login");
});

router.post("/login", isLoggedOut, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
        successRedirect: '/campgrounds',
        successFlash: true,
        successFlash: "Welcome!"
    }),
    (_req, _res) => {});

router.get("/logout", isLoggedIn, (req, res) => {
    // res.clearCookie('remember_me');
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect('/campgrounds');
});

router.get("/profile/@:uname", isLoggedIn, (req, res) => {
    Campgrounds.find({
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, userCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            Campgrounds.find({
                likes: req.user._id
            }, (err, likedCampgrounds) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("profile", {
                        userCampgrounds: userCampgrounds,
                        likedCampgrounds: likedCampgrounds
                    });
                }
            });
        }
    });
});

router.put("/pedit/:id", isLoggedIn, (req, res) => {
    if (req.params.id.toString() == req.user._id.toString()) {
        var updatedUser = {
            firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
            lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            description: req.body.description,
        };
        User.findByIdAndUpdate(req.user._id, updatedUser, (err) => {
            if (err) {
                res.redirect("back");
            } else {
                req.flash("success", "Profile Updated");
                res.redirect("/profile/@" + req.body.username);
            }
        });
    } else {
        res.redirect("back");
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Logout First!");
    res.redirect("/campgrounds");
};

module.exports = router;