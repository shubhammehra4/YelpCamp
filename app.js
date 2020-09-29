const express = require('express'),
dotenv        = require('dotenv'),
app           = express();

dotenv.config();
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.send("Hello");
});


app.listen(process.env.PORT, function () {
    console.log("Server is running!");
    console.log(`Your Port is ${process.env.PORT}`);
});
