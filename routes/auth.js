const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Campgrounds = require("../models/campgrounds"),
    User = require("../models/user"),
    catchAsync = require("../utils/catchAsync");

const { isLoggedIn, isLoggedOut } = require("../middlewares/authorization");

router.get("/register", isLoggedOut, (_req, res) => {
    res.render("users/register");
});

router.post(
    "/register",
    isLoggedOut,
    catchAsync(async (req, res, next) => {
        try {
            const { name, email, username, password } = req.body;
            const user = new User({ email, username, name });
            const newUser = await User.register(user, password);
            req.login(newUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to Yelp Camp!");
                res.redirect("/campgrounds");
            });
        } catch (err) {
            if (err.code == 11000) {
                req.flash("error", "Email is already registered!");
                res.redirect("/register");
            } else {
                req.flash("error", err.message);
                res.redirect("/register");
            }
        }
    })
);

router.get("/login", isLoggedOut, (_req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    isLoggedOut,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome Back!");
        const redirectUrl = req.session.returnTo || "/campgrounds";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect("/campgrounds");
});

router.get("/profile/@:uname", isLoggedIn, (req, res) => {
    Campgrounds.find(
        {
            author: {
                id: req.user._id,
                username: req.user.username,
            },
        },
        (err, userCampgrounds) => {
            if (err) {
                console.log(err);
            } else {
                Campgrounds.find(
                    {
                        likes: req.user._id,
                    },
                    (err, likedCampgrounds) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("profile", {
                                userCampgrounds: userCampgrounds,
                                likedCampgrounds: likedCampgrounds,
                            });
                        }
                    }
                );
            }
        }
    );
});

router.put("/pedit/:id", isLoggedIn, (req, res) => {
    if (req.params.id.toString() == req.user._id.toString()) {
        var updatedUser = {
            firstName:
                req.body.firstName.charAt(0).toUpperCase() +
                req.body.firstName.slice(1),
            lastName:
                req.body.lastName.charAt(0).toUpperCase() +
                req.body.lastName.slice(1),
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

module.exports = router;
