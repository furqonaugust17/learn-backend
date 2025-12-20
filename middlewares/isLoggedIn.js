module.exports = (req, res, next) => {
  if (res.locals.currentUser) {
    return res.redirect("/places");
  }
  next();
};
