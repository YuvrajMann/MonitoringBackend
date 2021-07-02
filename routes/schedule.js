var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
var authenticate=require('../authenticate');
var Schedule=require('../models/schedule');
router.use(bodyParser.json());

let days=['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

router.get('/getUserSchedule',authenticate.verifyUser,(req,res,next)=>{
    Schedule.find({user:req.user._id}).then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ resp });
    })
    .catch((err)=>{
        next(err);
    })  
});

router.post('/setWorkTime',authenticate.verifyUser,(req,res,next) =>{
    let schedule={};
    
    schedule.user=req.user._id;
    console.log(schedule);
    Schedule.create(
        schedule
    ).then((resp)=>{
        Schedule.findById(resp._id).then((sche)=>{
            let input=req.body.schedule;
            let n=input.length;
            let newRange=[];
            for(let i=0;i<n;++i){
                let obj=input[i];
                let day=obj.day;
                let range={day:day,startTime:obj.startTime,endTime:obj.endTime};
                newRange.push(range);
                sche.schedule=newRange;
            }

            sche.save().then((response)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ response });
            })
            .catch((err)=>{
                next(err);
            })
        })
    })
    .catch((err)=>{
        next(err);
    })
});

router.post('/addWork/:scheduleId',authenticate.verifyUser,(req,res,next)=>{
    let scheduleId=req.params.scheduleId.toString();
    Schedule.findById(scheduleId).then((sche)=>{
        let input=req.body.schedule;
        let n=input.length;
        let newRange=sche.schedule;
        for(let i=0;i<n;++i){
            let obj=input[i];
            let day=obj.day;
            let range={day:day,startTime:obj.startTime,endTime:obj.endTime};
            newRange.push(range);
            sche.schedule=newRange;
        }

        sche.save().then((response)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ response });
        })
        .catch((err)=>{
            next(err);
        })
    })
});

router.post('/setBlockedApps/:scheduleId',authenticate.verifyUser,(req,res,next)=>{
    let scheduleId=req.params.scheduleId.toString();

    Schedule.findById(scheduleId).then((schedule)=>{
        let blockedApps=schedule.blockedApps;
        let input=req.body.apps;

        let n=input.length;

        for(let i=0;i<n;++i){
            let index=-1;
            for(let j=0;j<blockedApps.length;++j){
                if(blockedApps[j].toString()==input[i].toString()){
                    index=j;
                    break;
                }
            }
            if(index==-1){
                blockedApps.push(input[i]);
            }
        }

        schedule.blockedApps=blockedApps;
        console.log(schedule);
        schedule.save().then((response)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ response });
        })
        .catch((err)=>{
            next(err);
        })
    })
    .catch((err)=>{
        next(err);
    });
});

router.post('/setRestrictedApps/:scheduleId',authenticate.verifyUser,(req,res,next)=>{
    let scheduleId=req.params.scheduleId.toString();

    Schedule.findById(scheduleId).then((schedule)=>{
        let restrictedApps=schedule.restrictedApps;
        let input=req.body.apps;

        let n=input.length;

        for(let i=0;i<n;++i){
            let index=-1;
            for(let j=0;j<restrictedApps.length;++j){
                if(restrictedApps[j].appName.toString()==input[i].appName.toString()){
                    index=j;
                    break;
                }
            }
            if(index==-1){
                restrictedApps.push({
                    appName:input[i].appName,
                    durationAllowed:input[i].durationAllowed
                });
            }
        }
        console.log(restrictedApps);
        schedule.restrictedApps=restrictedApps;

        schedule.save().then((response)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ response });
        })
        .catch((err)=>{
            next(err);
        })
    })
    .catch((err)=>{
        next(err);
    });
});

router.delete('/setNewSchedule/:scheduleId',authenticate.verifyUser,(req,res,next)=>{
    let scheduleId=req.params.scheduleId.toString();
    let day=req.body.day.toString();
    let newSchedule=req.body.schedule;

    Schedule.findById(scheduleId).then((schedule)=>{
        let oldSchedule=schedule.schedule;

        let updated=[];

        let n=oldSchedule.length;

        for(let i=0;i<n;++i){
            let temp=oldSchedule[i];
            if(temp.day.toString()!=day){
                updated.push(temp);
            }
        }

        let n1=newSchedule.length;

        for(let i=0;i<n1;++i){
            let temp=newSchedule[i];
            updated.push(temp);
        }

        schedule.schedule=updated;

        schedule.save().then((resp)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ resp });
        })
        .catch((err)=>{
            next(err);
        })
    })
    .catch((err)=>{
        next(err);
    });
});

router.delete('/removeBlockedApps/:scheduleId',authenticate.verifyUser,(req,res,next)=>{
    let scheduleId=req.params.scheduleId.toString();
    let apps=req.body.apps;
    Schedule.findById(scheduleId).then((schedule)=>{
        let blockedApps=schedule.blockedApps;

        let n=apps.length;

        for(let i=0;i<n;++i){
            let j=0;
            let val=apps[i];

            while(j<blockedApps.length){
                if (blockedApps[j].toString() == val.toString()) {
                    blockedApps.splice(j, 1);
                } else {
                    ++j;
                }
            }
        }

        schedule.blockedApps=blockedApps;

        schedule.save().then((resp)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ resp });
        })
        .catch((err)=>{
            next(err);
        })
    })
    .catch((err)=>{
        next(err);
    })
});

router.delete('/removeRestrictedApps/:scheduleId',authenticate.verifyUser,(req,res,next)=>{
    let scheduleId=req.params.scheduleId.toString();
    let apps=req.body.apps;
    Schedule.findById(scheduleId).then((schedule)=>{
        let restrictedApps=schedule.restrictedApps;
        let n=apps.length;

        for(let i=0;i<n;++i){
            let j=0;
            let val=apps[i];

            while(j<restrictedApps.length){
                if (restrictedApps[j].appName.toString() == val.toString()) {
                    restrictedApps.splice(j, 1);
                } else {
                    ++j;
                }
            }
        }

        schedule.restrictedApps=restrictedApps;
        
        schedule.save().then((resp)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ resp });
        })
        .catch((err)=>{
            next(err);
        })
    })
});
module.exports = router;