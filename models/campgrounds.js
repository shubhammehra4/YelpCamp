const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

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
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        images: [ImageSchema],
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
        toJSON: { virtuals: true },
    }
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.name}</a></strong>
    <p>${this.description.substring(0, 25)}...</p>`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

module.exports = mongoose.model("Campgrounds", CampgroundSchema);
