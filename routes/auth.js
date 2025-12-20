const AuthController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const isLoggedIn = require("../middlewares/isLoggedIn");

router
  .route("/register")
  .get(isLoggedIn, AuthController.registerForm)
  .post(isLoggedIn, asyncWrap(AuthController.register));

router
  .route("/login")
  .get(isLoggedIn, AuthController.loginForm)
  .post(
    isLoggedIn,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: {
        type: "error_msg",
        message: "Invalid username or password",
      },
    }),
    AuthController.login
  );

router.post("/logout", AuthController.logout);

module.exports = router;
