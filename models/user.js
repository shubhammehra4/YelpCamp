const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    googleid: String,
    password: String,
    likedCampgrounds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campgrounds"
        }
    ],
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);