const Campgrounds = require("../models/campgrounds");

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

exports.isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Already Logged In!");
    res.redirect("/campgrounds");
};

exports.checkCampgroundOwnership = async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const campground = await Campgrounds.findById(req.params.id);
            if (campground.author.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Unauthorized Request!");
                res.redirect("back");
            }
        } catch (err) {
            req.flash("error", "Error! Try Again!");
            res.redirect("/campgrounds");
        }
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};
