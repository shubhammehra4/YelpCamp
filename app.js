if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    ejsMate = require("ejs-mate"),
    session = require("express-session"),
    MongoDBStore = require("connect-mongo")(session),
    flash = require("connect-flash"),
    mongoSanitize = require("express-mongo-sanitize"),
    helmet = require("helmet"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    methodOverride = require("method-override"),
    User = require("./models/user"),
    ExpressError = require("./utils/ExpressError");

const indexRoutes = require("./routes/index"),
    campgroundsRoutes = require("./routes/campground"),
    authRoutes = require("./routes/auth");

const store = new MongoDBStore({
    url: process.env.DATABASEURL,
    secret: process.env.SESSION_STORE_SECRET,
    touchAfter: 24 * 3600,
});

store.on("error", function (e) {
    console.log("Session Store Error: ", e);
});

const sessionConfig = {
    name: "MongoSession",
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
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
app.use(mongoSanitize({ replaceWith: "_" }));
if (process.env.NODE_ENV !== "production") {
    const morgan = require("morgan");
    app.use(morgan("tiny"));
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

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
