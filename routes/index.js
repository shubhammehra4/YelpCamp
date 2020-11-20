const express = require('express'),
    router = express.Router();

router.get("/", (req, res) => {
    res.render('index');
});

router.get("/aboutus", (req, res) => {
    res.render('about');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // req.flash("error", "Please Login First!");
    res.redirect("/login");
};
module.exports = router;
