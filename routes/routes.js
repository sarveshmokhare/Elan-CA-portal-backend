const cookieSession = require("cookie-session");
const { Router } = require("express");
const passport = require("passport");
const passportsetup = require("../config/passport-setup");
const authcontrol = require("../controllers/authcontroller");
const route = Router();
const User = require("../models/User");
const Task = require("../models/Tasks");
const alert = require("alert");
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
    scope: ["profile", "email"],
  })
);
route.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/user");
});
route.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

route.post("/profile", async (req, res) => {
  const { yourname, username2, collegename, phone } = req.body;
  console.log(yourname);
  var myquery = { googleID: req.user.googleID };
  var newvalues = {
    $set: { yourname: yourname, username2: username2, collegename: collegename, phno: phone },
  };
  const username_check = await User.find({ $and: [{ username2: username2 }, { googleID: { $ne: req.user.googleID } }] })
  if (username_check.length == 1) alert("username already taken")

  const phno_check = await User.find({ $and: [{ phno: phone }, { googleID: { $ne: req.user.googleID } }] })
  if (phno_check.length == 1) alert("phone number already in use")
  User.updateOne(myquery, newvalues, function (err) {
    if (err) {
      return res.json({ status: "failed" });
    }
    return res.json({ status: "success" });
  });
});

route.get("/profile/user", authCheck, (req, res) => {
  if (req.user.collegename) {

    let userData = req.user;
    const totalPoints = userData.task0[1] + userData.task1[1] + userData.task2[1] + userData.task3[1] + userData.task4[1] + userData.task5[1] + userData.task6[1] + userData.task7[1] + userData.task8[1] + userData.task9[1];

    console.log("req.user: ", req.user);
    User.findOneAndUpdate({ googleID: req.user.googleID }, { points: totalPoints }, err => {
      if (!err) res.render("user", { user: req.user });

      else res.json({ status: "failed", errorMessage: err });
    });

  } else {
    res.redirect("/profile");
  }
});
count = 0;
route.get("/profile/leaderboard", authCheck, (req, res) => {
  if (req.user.collegename) {
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
  } else {
    alert("For that u have to enter your Details");
    res.redirect("/profile");
  }
});
route.get("/profile/tasks", async (req, res) => {
  if (req.user.collegename) {
    const tasks = await Task.find({});
    console.log(tasks);
    res.render("tasks", { tasks: tasks, user: req.user });
  } else {
    alert("For that u have to enter your Details");
    res.redirect("/profile");
  }
});
route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = route;
