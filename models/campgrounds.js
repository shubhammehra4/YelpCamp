const mongoose        = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

var CampgroundSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    coverImage: String,
    description: String,
    images: [],
    comments: [],
});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);