const mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
    name         :{ type: String, unique: true },
    coverImage   : String,
    description  : String,
    pricing      : Number,
    ratingNumber :  { type: Number, default: 0 },
    ratingCount  : { type: Number, default: 0 },
    address      : String,
    webLink      : String,
    loaction: {
        lat: Number,
        lon: Number
    },
    author: {
        id: {
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
}, { timestamps: true });

module.exports = mongoose.model("Campgrounds", CampgroundSchema);