const mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    coverImage: String,
    description: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    images: [],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);