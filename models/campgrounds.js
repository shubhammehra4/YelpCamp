const mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    coverImage: String,
    description: String,
    pricing: Number,
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
}, {timestamps:true});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);