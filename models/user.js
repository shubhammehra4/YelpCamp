const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    phoneNumber: Number,
    googleid: String,
    description: String,
    password: String,
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);