const express         = require('express'),
router = express.Router();

router.get("/", function(req, res){
    res.render('index');
});


router.get("/aboutus", function (req, res) {
    res.send("Hello");
});

router.get("/resources", function (req, res) {
    res.send("Hello");
});

// router.get("*", function (req, res) {
//     res.send("Return to home nothing here");
// });

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please Login First!");
    res.redirect("/login");
};
module.exports = router;
