const express = require('express'),
router        = express.Router(),
Campgrounds   =  require('../models/campgrounds'),
User          = require('../models/user'),
Comment       = require('../models/comment');

//**                MAIN

router.get("/campgrounds", function (req, res) {
    Campgrounds.find({}, function (err, allcampgrounds) {
        if(err){
            console.log(err);
            // flash error : Please try again
            res.redirect("/");
        } else{
            res.render('campgrounds',{campgrounds: allcampgrounds});
        }
    });
});

//**                CREATE

router.get("/campgrounds/new", isLoggedIn, function (req, res) {
    res.render('campgroundNew');
});

router.post("/campgrounds/new", isLoggedIn,function (req, res) {
    var cAuthor = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = new Campgrounds({
        name: req.body.name,
        coverImage: req.body.image,
        description: req.body.description,
        author:cAuthor,
        pricing: req.body.pricing,
        address: req.body.address,
        startMonth: req.body.startmonth,
        endMonth: req.body.endmonth
    });
    // console.log(req.body.startmonth);
    // console.log(req.body.endmonth);
    if(req.body.contact){
        newCampground.contact = req.body.contact
    }
    Campgrounds.create(newCampground, function (err, campground) {
        if(err){
            if(err.code == 11000){
                req.flash("error", "Campground with this name already exists!");
                res.redirect("/campgrounds");
            } else{
                console.log(err);
                req.flash("error", "Error! Please Try Again");
                res.redirect("/campgrounds");
            }
            
        } else{
            req.flash("success", "Created Campground!");
            res.redirect("/campgrounds");
        }
    });
});

//**                SHOW

router.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
            req.flash("error", "Error! Please try again");
            res.redirect("/campgrounds");
        } else{
            res.render("campgroundShow", {campground: foundCampground});
        }
    });
});

//**                UPDATE

router.get("/campground/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campgrounds.findById(req.params.id, function (err, foundCampground) {
        if(err){
            req.flash("error", "Error! Please Try Again");
            res.redirect('back');     
        } else {
            res.render('campgroundEdit', {campground: foundCampground});
        }
    })
})

router.put("/campground/:id/edit", checkCampgroundOwnership, function (req, res) {
    var updatedCampground ={
        name: req.body.name,
        coverImage: req.body.image,
        description: req.body.description,
        pricing: req.body.pricing,
        address: req.body.address,
        startMonth: req.body.startmonth,
        endMonth: req.body.endmonth,
        contact : req.body.contact
    };
    Campgrounds.findByIdAndUpdate(req.params.id, updatedCampground, function (err, campground) {
        if(err){
            req.flash("error", "Error! Please Try Again");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Edited "+campground.name);
            res.redirect("/campground/" + req.params.id);
        }
    })
})

//**                DESTROY

router.delete("/campground/:id/delete", checkCampgroundOwnership, function (req, res) {
    Campgrounds.findByIdAndDelete(req.params.id, function (err, campground) {
        if(err){
            req.flash("error", "Error! Please Try Again");
            res.redirect("/campgrounds");
        }
        // campground.comments.forEach();
        req.flash("success", "Deleted Campground");
        res.redirect("/campgrounds");
    })
})

//**                COMMENTS

router.post("/campground/:id/comment", isLoggedIn, function (req, res) {
    Campgrounds.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else{
            var newComment = {
                text: req.body.comment,
                rating: req.body.star
            }
            Comment.create(newComment, function (err, comment) {
                if(err){
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.ratingCount +=1;
                    campground.ratingNumber = campground.ratingNumber + Number(req.body.star);
                    campground.hasRated.push(req.user._id);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});

router.delete("/campground/:id/comment/:uid",isLoggedIn, function (req, res) {
    if(req.params.uid.toString() == req.user._id.toString()){
        Campgrounds.findById(req.params.id, function(err, campground) {
            if(err){
                req.flash("error", "Please Try Again!");
                res.redirect("back");
            } else {
                Comment.findOneAndRemove({author: {id: req.user._id, username: req.user.username}}, function (err, comment) {
                    if(err){
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
                });
            }
        });
    } else {
        res.redirect("back");
    }
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, function (err, foundCampground) {
            if(err){
                req.flash("error", "Error! Please Try Again");
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "Unauthorised Request!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};

module.exports = router;