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


          var find = await User.findOne({ email: profile._json.email })
          if (find) {
            var update = await User.updateOne({ email: profile._json.email },
              {
                $set: {
                  googleName: profile.displayName,
                  googleID: profile.id,
                  thumbnail: profile._json.picture,
                  campambid: num + 1001,
                  email: profile._json.email,
                }
              }
            )

            User.findOne({ email: profile._json.email })

              .then((user) => {
                console.log("in passport-setup page, logging profile: ", profile);
                done(null, user);
                console.log("in passport-setup page, logging user: ", user);
              })
              .catch((err) => {
                console.log("Error in passport-setup file: ", err);
              });



          }
          else {

            new User({
              googleName: profile.displayName,
              googleID: profile.id,
              thumbnail: profile._json.picture,
              campambid: num + 1001,
              email: profile._json.email,
            })
              .save()
              .then((user) => {
                console.log("in passport-setup page, logging profile: ", profile);
                done(null, user);
                console.log("in passport-setup page, logging user: ", user);
              })
              .catch((err) => {
                console.log("Error in passport-setup file: ", err);
              });
          }

          // User.findOne({email:profile._json.email})


        }
      });
    }
  )
);
