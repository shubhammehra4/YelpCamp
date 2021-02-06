require("dotenv").config();
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    methodOverride = require("method-override"),
    User = require("./models/user"),
    indexRoutes = require("./routes/index"),
    campgroundsRoutes = require("./routes/campground"),
    authRoutes = require("./routes/auth"),
    // seedDB = require('./Seed/seeds'),
    app = express();

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(flash());
app.use(
    require("express-session")({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use(authRoutes);
app.use(campgroundsRoutes);

//!                 DEBUG DB
// seedDB();

/**
 * TODO: Campgrounds Categories && sortby
 * TODO: Mailing System
 * TODO: Stats
 */

//**                    Port

app.listen(process.env.PORT, function () {
    console.log("Server is running!");
    console.log(`Your Port is ${process.env.PORT}`);
});
