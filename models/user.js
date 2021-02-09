const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true,
        },
        bio: String,
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
