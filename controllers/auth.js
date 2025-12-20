const User = require("../models/user");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports.registerForm = (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.loginForm = (req, res) => {
  res.render("auth/login");
};

module.exports.login = (req, res) => {
  req.flash("success_msg", "You are logged in");
  res.redirect("/places");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
};
