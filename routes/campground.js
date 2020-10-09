const express         = require('express'),
router = express.Router(),
Campgrounds           =  require('../models/campgrounds'),
Comment               = require('../models/comment');

router.get("/campgrounds", function (req, res) {
    Campgrounds.find({}, function (err, allcampgrounds) {
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds',{campgrounds: allcampgrounds});
        }
    })
    
});

router.get("/campgrounds/new", function (req, res) {
    res.render('campgroundNew');
});

router.post("/campgrounds/new", function (req, res) {
    var newCampground = new Campgrounds({
        name: req.body.name,
        coverImage: req.body.image,
        description: req.body.description
    });
    Campgrounds.create(newCampground, function (err, msg) {
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
});

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

router.post("/campground/:id/comment/:uid", function (req, res) {
    Campgrounds.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else{
            var newComment = {
                author: req.params.uid,
                text: req.body.comment,
            }
            Comment.create(newComment, function (err, comment) {
                if(err){
                    console.log(err);
                } else{
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

module.exports = router;