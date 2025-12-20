const ejsmate = require("ejs-mate");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const ErrorHandler = require("./utils/ErrorHandler");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

mongoose
  .connect("mongodb://localhost:27017/bestpoints")
  .then((result) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", require("./routes/auth"));

app.use("/places", require("./routes/places"));
app.use("/places/:place_id/reviews", require("./routes/reviews"));

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "ada kesalahan pada server" } = err;
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
