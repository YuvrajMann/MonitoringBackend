var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
var passport = require("passport");
var authenticate = require("../authenticate");
router.use(bodyParser.json());
const User = require("../models/users");

router.get('/getInfo',authenticate.verifyUser,(req,res,next)=>{
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.user);
})

router.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    else{
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: false,
            status: "Login Unsuccessful!",
            err: "Could not log in user!",
          });
        }
        else{
          var token = authenticate.getToken({ _id: req.user._id });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Login Successful!", token: token });
        }
        
      });
    }
  })(req, res, next);
});

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  User.register(
    new User({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err, req.body);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});
module.exports = router;