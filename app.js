if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    ejsMate = require("ejs-mate"),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    methodOverride = require("method-override"),
    User = require("./models/user"),
    ExpressError = require("./utils/ExpressError");

const indexRoutes = require("./routes/index"),
    campgroundsRoutes = require("./routes/campground"),
    authRoutes = require("./routes/auth");

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 604800000,
        maxAge: 604800000,
    },
};
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(morgan("tiny"));
app.use(session(sessionConfig));
app.use(flash());

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
app.use("/campgrounds", campgroundsRoutes);

/**
 * TODO: Campgrounds Categories && sortby
 * TODO: Mailing System
 * TODO: Stats
 */

//**                    Error Handler
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

//**                    Port

app.listen(process.env.PORT, function () {
    console.log(
        `Server is running on http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} env`
    );
});
