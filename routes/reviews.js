const ReviewController = require("../controllers/reviews");
const asyncWrap = require("../utils/asyncWrap");

const express = require("express");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorReview } = require("../middlewares/isAuthor");
const { validateReview } = require("../middlewares/validator");
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validateReview,
  asyncWrap(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  asyncWrap(ReviewController.destoy)
);

module.exports = router;
