const mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    coverImage: String,
    description: String,
    images: [],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);