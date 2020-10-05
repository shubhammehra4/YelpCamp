const express = require('express'),
bodyParser    = require("body-parser"),
dotenv        = require('dotenv'),
app           = express();

dotenv.config();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


//**                    Main Routes

app.get("/", function(req, res){
    res.render('index');
});

app.get("/campgrounds", function (req, res) {
    res.render('campgrounds');
});

//**                    Authentication

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", function (req, res) {
    res.send("hello");
});

app.get("/login", function name(req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    res.send("hello");
});

//**                    Misc

app.get("/aboutus", function (req, res) {
    res.send("Hello");
});

app.get("/resources", function (req, res) {
    res.send("Hello");
});

app.get("*", function (req, res) {
    res.send("Return to home nothing here");
});

app.listen(process.env.PORT,process.env.IP , function () {
    console.log("Server is running!");
    console.log(`Your Port is ${process.env.PORT}`);
});
