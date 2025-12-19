const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
const ErrorHandler = require("../utils/ErrorHandler");
const passport = require("passport");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/register", isLoggedIn, (req, res) => {
  res.render("auth/register");
});
router.post(
  "/register",
  isLoggedIn,
  asyncWrap(async (req, res, next) => {
    try {
      const { username, email, password, confirm_password } = req.body;

      if (password !== confirm_password) {
        return next(
          new ErrorHandler("confirmation password not same with password", 400)
        );
      }

      const user = new User({
        email: email,
        username: username,
      });

      const registerUser = await User.register(user, password);
      req.login(registerUser, (err) => {
        if (err) return next(err);
        req.flash("success_msg", "You are registered and logged in");
        res.redirect("/places");
      });
    } catch (error) {
      req.flash("error_msg", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", isLoggedIn, (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  isLoggedIn,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "error_msg",
      message: "Invalid username or password",
    },
  }),
  (req, res) => {
    req.flash("success_msg", "You are logged in");
    res.redirect("/places");
  }
);

router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
});

module.exports = router;
