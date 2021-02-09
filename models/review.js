const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var reviewSchema = new Schema(
    {
        text: String,
        rating: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", reviewSchema);
