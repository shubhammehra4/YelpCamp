const express = require("express"),
    router = express.Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/about", (req, res) => {
    res.render("about");
});

module.exports = router;
