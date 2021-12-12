const cookieSession = require("cookie-session");
const { Router } = require("express");
const passport = require("passport");
const passportsetup = require("../config/passport-setup");
const authcontrol = require("../controllers/authcontroller");
const route = Router();
const User = require("../models/User");
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

route.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
route.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/user");
});
route.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

route.post("/profile", (req, res) => {
  const { yourname, collegename, phone } = req.body;
  console.log(yourname);
  var myquery = { googleID: req.user.googleID };
  var newvalues = {
    $set: { yourname: yourname, collegename: collegename, phno: phone },
  };
  User.updateOne(myquery, newvalues, function (err) {
    if (err) {
      return res.json({ status: "failed" });
    }
    return res.json({ status: "success" });
  });
});

route.get("/profile/user", authCheck, (req, res) => {
  if (req.user.collegename) {
    res.render("user", { user: req.user });
  } else {
    res.redirect("/profile");
  }
});
count = 0;
route.get("/profile/leaderboard", authCheck, (req, res) => {
  User.find({})
    .sort({ points: -1 })
    .exec((err, users) => {
      res.render("leaderboard", {
        users: users,
        king: req.user,
        user: req.user,
      });
      console.log(users);
    });
});
route.get("/profile/tasks", (req, res) => {
  res.render("tasks", { user: req.user });
});
route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = route;
