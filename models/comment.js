const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    rating: Number,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
}, { timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);