const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

var CampgroundSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        price: Number,
        description: String,
        location: String,
        image: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        facilities: [],
        startMonth: String,
        endMonth: String,
        rating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);
