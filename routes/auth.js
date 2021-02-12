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

router.get(
    "/profile/@:uname",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const likedCampgrounds = await User.findById(req.user._id)
            .populate("likes")
            .select("likes");
        const userCampgrounds = await Campgrounds.find({
            author: req.user._id,
        });
        res.render("users/profile", { userCampgrounds, likedCampgrounds });
    })
);

module.exports = router;
