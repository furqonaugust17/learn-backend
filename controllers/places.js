const Place = require("../models/place");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const { geometry } = require("../utils/openStreetMap");

module.exports.index = async (req, res) => {
  const places = await Place.find({});
  const clustering = places.map((place) => {
    return {
      lat: place.geometry.coordinates[0],
      lng: place.geometry.coordinates[1],
    };
  });
  const clustered = JSON.stringify(clustering);
  res.render("place/index", { places, clustered });
};

module.exports.create = (req, res) => {
  res.render("place/create");
};

module.exports.store = async (req, res, next) => {
  const images = req.files.map((image) => ({
    url: image.path,
    filename: image.filename,
  }));
  const geoData = await geometry(req.body.place.location);
  const data = {
    ...req.body.place,
    geometry: geoData,
    images,
    author: req.user._id,
  };

  const place = new Place(data);
  await place.save();

  req.flash("success_msg", "Place added successfully");
  res.redirect("/places");
};

module.exports.show = async (req, res) => {
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
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("place/edit", { place });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const { place } = req.body;
  const geoData = await geometry(place.location);
  const newPlace = await Place.findByIdAndUpdate(id, {
    ...place,
    geometry: geoData,
  });

  if (req.files && req.files.length > 0) {
    newPlace.images.forEach((image) => {
      fs.unlink(image.url, (err) => new ErrorHandler(err));
    });

    const images = req.files.map((image) => ({
      url: image.path,
      filename: image.filename,
    }));

    newPlace.images = images;
    await newPlace.save();
  }

  req.flash("success_msg", "Place updated successfully");
  res.redirect(`/places/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;

  const place = await Place.findById(id);

  if (place.images.length > 0) {
    place.images.forEach((image) => {
      fs.unlink(image.url, (err) => new ErrorHandler(err));
    });
  }

  await place.deleteOne();

  req.flash("success_msg", "Place deleted successfully");
  res.redirect("/places");
};

module.exports.destroyImages = async (req, res) => {
  const { id } = req.params;
  try {
    const { images } = req.body;

    if (!images || images.length === 0) {
      req.flash("error_msg", "minimal select 1 image");
      return res.redirect(`/places/${id}/edit`);
    }

    images.forEach((image) => {
      fs.unlinkSync(image);
    });

    await Place.findByIdAndUpdate(id, {
      $pull: { images: { url: { $in: images } } },
    });
    req.flash("success_msg", "Successfully deleted images");
    return res.redirect(`/places/${id}/edit`);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Failed to delete image");
    return res.redirect(`/places/${id}/edit`);
  }
};
