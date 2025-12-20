const Place = require("../models/place");

module.exports.index = async (req, res) => {
  const places = await Place.find({});
  res.render("place/index", { places });
};

module.exports.create = (req, res) => {
  res.render("place/create");
};

module.exports.store = async (req, res, next) => {
  const data = { ...req.body.place, author: req.user._id };
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
  await Place.findByIdAndUpdate(id, { ...req.body.place });
  req.flash("success_msg", "Place updated successfully");
  res.redirect(`/places/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;

  await Place.findByIdAndDelete(id);
  req.flash("success_msg", "Place deleted successfully");
  res.redirect("/places");
};
