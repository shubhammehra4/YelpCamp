const mongoose        = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");


 var UserSchema = new mongoose.Schema({
    firstName         : String,
    lastName          : String,
    username          : {type:String , unique:true},
    email             : {type:String , unique:true},
    googleid          : String,
    password          : String,
 });

UserSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model("User", UserSchema);