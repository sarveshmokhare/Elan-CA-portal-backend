const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/key");
const route = require("./routes/routes");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");
const app = express();
//template engine
app.set("view engine", "ejs");
//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
//connection to database
const dbURI = keys.mongo.code;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    UseUNifiedTopology: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log("connected");
  })
  .catch((err) => console.log(err));
//middleware

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookiekey],
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("signup", { user: req.user });
});
app.get("/signup", (req, res) => res.render("signup"));
app.use(route);
app.get("*", (req, res) => res.send("404 error page Not Found"));
