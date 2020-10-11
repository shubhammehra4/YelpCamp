const express = require('express'),
router        = express.Router(),
Campgrounds   =  require('../models/campgrounds'),
Comment       = require('../models/comment');

//**                MAIN

router.get("/campgrounds", function (req, res) {
    Campgrounds.find({}, function (err, allcampgrounds) {
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds',{campgrounds: allcampgrounds});
        }
    })
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
        author:cAuthor
    });
    Campgrounds.create(newCampground, function (err, msg) {
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
});

//**                SHOW

router.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
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
    };
    Campgrounds.findByIdAndUpdate(req.params.id, updatedCampground, function (err, campground) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    })
})

//**                DESTROY

router.delete("/campground/:id/delete", checkCampgroundOwnership, function (req, res) {
    Campgrounds.findByIdAndDelete(req.params.id, function (err) {
        if(err){
            res.redirect("/campgrounds");
        }
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
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                }
            })
        }
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please Login First!");
    res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, function (err, foundCampground) {
            if(err){
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
};

module.exports = router;