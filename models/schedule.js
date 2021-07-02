var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');

let appSchema=new Schema({
    appName:{type:String},
    durationAllowed:{type:String},
});

let daySchedule=new Schema({
    day:{
        type:String,
    },
    startTime:{
        type:String,
    },
    endTime:{
        type:String,
    }
});
let Schedule=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    blockedApps:{
        type:[mongoose.Schema.Types.String],
    },
    restrictedApps:[appSchema],
    schedule:[daySchedule]
})

module.exports = mongoose.model("Schedule", Schedule);