const express = require('express'),
    router = express.Router();

router.get("/", (_req, res) => {
    res.render('index');
});

router.get("/aboutus", (_req, res) => {
    res.render('about');
});

module.exports = router;