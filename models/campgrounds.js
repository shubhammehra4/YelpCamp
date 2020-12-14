const mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    image: String,
    description: String,
    pricing: Number,
    contact: Number,
    location: String,
    amenities:[],
    ratingNumber: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    startMonth: String,
    endMonth: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    hasRated: [],
    images: [],
    likes: [],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);