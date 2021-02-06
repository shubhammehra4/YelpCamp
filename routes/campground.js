const express = require("express"),
    router = express.Router(),
    Campgrounds = require("../models/campgrounds"),
    User = require("../models/user"),
    Comment = require("../models/comment");

//**                MAIN

router.get("/campgrounds", (_req, res) => {
    Campgrounds.find({}, (err, allcampgrounds) => {
        if (err) {
            console.log(err);
            //! flash error : Please try again
            res.redirect("/");
        } else {
            res.render("campgrounds", {
                campgrounds: allcampgrounds,
            });
        }
    });
});

//**                CREATE

router.get("/campgrounds/new", isLoggedIn, (_req, res) => {
    res.render("campgroundNew");
});

router.post("/campgrounds/new", isLoggedIn, (req, res) => {
    var cAuthor = {
        id: req.user._id,
        username: req.user.username,
    };
    req.body.campground.author = cAuthor;
    req.body.campground.amenities = req.body.campground.amenities.split(",");
    Campgrounds.create(req.body.campground, (err, _campground) => {
        if (err) {
            if (err.code == 11000) {
                req.flash("error", "Campground with this name already exists!");
                res.redirect("/campgrounds");
            } else {
                console.log(err);
                req.flash("error", "Error! Please Try Again");
                res.redirect("/campgrounds");
            }
        } else {
            req.flash("success", "Created Campground!");
            res.redirect("/campgrounds");
        }
    });
});

//**                SHOW

router.get("/campground/:id", (req, res) => {
    Campgrounds.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
            if (err) {
                console.log(err);
                req.flash("error", "Error! Please try again");
                res.redirect("/campgrounds");
            } else {
                res.render("campgroundShow", {
                    campground: foundCampground,
                });
            }
        });
});

//**                UPDATE

router.get("/campground/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campgrounds.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash("error", "Error! Please Try Again");
            res.redirect("back");
        } else {
            res.render("campgroundEdit", {
                campground: foundCampground,
            });
        }
    });
});

router.put("/campground/:id/edit", checkCampgroundOwnership, (req, res) => {
    req.body.campground.amenities = req.body.campground.amenities.split(",");
    Campgrounds.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, campground) => {
            if (err) {
                if (err.code == 11000) {
                    req.flash(
                        "error",
                        "Campground with this name already exists!"
                    );
                    res.redirect("/campgrounds");
                } else {
                    console.log(err);
                    req.flash("error", "Error! Please Try Again");
                    res.redirect("/campgrounds");
                }
            } else {
                req.flash("success", "Edited " + campground.name);
                res.redirect("/campground/" + req.params.id);
            }
        }
    );
});

router.post("/save", isLoggedIn, (req, res) => {
    Campgrounds.findByIdAndUpdate(
        req.body.campgroundId,
        {
            $addToSet: {
                likes: req.user._id,
            },
        },
        (err, _campground) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successsful");
            }
        }
    );
});

router.delete("/unsave", isLoggedIn, (req, res) => {
    Campgrounds.findByIdAndUpdate(
        req.body.campgroundId,
        {
            $pull: {
                likes: req.user._id,
            },
        },
        (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successsful");
            }
        }
    );
});

//**                DESTROY

router.delete(
    "/campground/:id/delete",
    checkCampgroundOwnership,
    (req, res) => {
        Campgrounds.findByIdAndDelete(req.params.id, (err, _campground) => {
            if (err) {
                req.flash("error", "Error! Please Try Again");
                res.redirect("/campgrounds");
            }
            //TODO: campground.comments.forEach();
            req.flash("success", "Deleted Campground");
            res.redirect("/campgrounds");
        });
    }
);

//**                COMMENTS

router.post("/campground/:id/comment", isLoggedIn, (req, res) => {
    Campgrounds.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            var newComment = {
                text: req.body.comment,
                rating: req.body.star,
            };
            Comment.create(newComment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.ratingCount += 1;
                    campground.ratingNumber =
                        campground.ratingNumber + Number(req.body.star);
                    campground.hasRated.push(req.user._id);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});

router.delete("/campground/:id/comment/:uid", isLoggedIn, (req, res) => {
    if (req.params.uid.toString() == req.user._id.toString()) {
        Campgrounds.findById(req.params.id, (err, campground) => {
            if (err) {
                req.flash("error", "Please Try Again!");
                res.redirect("back");
            } else {
                Comment.findOneAndRemove(
                    {
                        author: {
                            id: req.user._id,
                            username: req.user.username,
                        },
                    },
                    (err, comment) => {
                        if (err) {
                            req.flash("error", "Please Try Again!");
                            res.redirect("back");
                        } else {
                            campground.comments.pull(comment);
                            campground.ratingCount -= 1;
                            campground.ratingNumber -= Number(comment.rating);
                            campground.hasRated.pull(req.user._id);
                            campground.save();
                            req.flash("success", "Deleted Review");
                            res.redirect("/campground/" + req.params.id);
                        }
                    }
                );
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
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Error! Please Try Again");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Unauthorised Request!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
}

module.exports = router;
