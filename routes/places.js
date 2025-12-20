const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");
const isValidObjectId = require("../middlewares/isValidObjectId");
const Place = require("../models/place");
const { placeSchema } = require("../schemas/places");
const asyncWrap = require("../utils/asyncWrap");
const ErrorHandler = require("../utils/ErrorHandler");
const express = require("express");
const router = express.Router();

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    return next(new ErrorHandler(msg, 400));
  }

  next();
};

router.get(
  "/",
  asyncWrap(async (req, res) => {
    const places = await Place.find({});
    res.render("place/index", { places });
  })
);

router.get("/create", isAuth, (req, res) => {
  res.render("place/create");
});

router.post(
  "/",
  isAuth,
  validatePlace,
  asyncWrap(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash("success_msg", "Place added successfully");
    res.redirect("/places");
  })
);

router.get(
  "/:id",
  isValidObjectId("/places"),
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    res.render("place/show", { place });
  })
);

router.put(
  "/:id",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  validatePlace,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { ...req.body.place });
    req.flash("success_msg", "Place updated successfully");
    res.redirect(`/places/${id}`);
  })
);

router.delete(
  "/:id",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  asyncWrap(async (req, res) => {
    const { id } = req.params;

    await Place.findByIdAndDelete(id);
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places");
  })
);

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("place/edit", { place });
  })
);

module.exports = router;
