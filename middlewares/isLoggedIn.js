module.exports = (req, res, next) => {
  if (res.locals.user) {
    return res.redirect("/places");
  }
  next();
};
