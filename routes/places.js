const PlaceController = require("../controllers/places");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");
const isValidObjectId = require("../middlewares/isValidObjectId");
const { validatePlace } = require("../middlewares/validator");
const asyncWrap = require("../utils/asyncWrap");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(asyncWrap(PlaceController.index))
  .post(isAuth, validatePlace, asyncWrap(PlaceController.store));

router.get("/create", isAuth, PlaceController.create);

router
  .route("/:id")
  .get(isValidObjectId("/places"), asyncWrap(PlaceController.show))
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    validatePlace,
    asyncWrap(PlaceController.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    asyncWrap(PlaceController.destroy)
  );
router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  asyncWrap(PlaceController.edit)
);

module.exports = router;
