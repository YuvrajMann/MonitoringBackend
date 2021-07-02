var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');

let User=new Schema({
    "firstname":{
        type:String,
    },
    "lastname":{
        type:String
    },
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);