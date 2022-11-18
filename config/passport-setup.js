const passport = require("passport");
const keys = require("./key");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");
var count = 1000;
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.Client_secret,
    },
    (acessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then(async (user) => {
        if (user) {
          done(null, user);
        } else {
          var num = await User.countDocuments();
          new User({
            username: profile.displayName,
            googleID: profile.id,
            thumbnail: profile._json.picture,
            campambid: num + 1001,
            email: profile._json.email,
          })
          .save()
          .then((user) => {
              console.log(profile);
              done(null, user);
              console.log(user);
            })
            .catch((error) => {
              console.log(err);
            });
        }
      });
    }
  )
);
