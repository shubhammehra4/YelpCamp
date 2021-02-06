const express = require("express"),
    router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/aboutus", (req, res) => {
    res.render("about");
});

module.exports = router;
