const ejsmate = require("ejs-mate");
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Place = require("./models/place");
const app = express();

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/bestpoints")
  .then((result) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/places",
  asyncWrap(async (req, res) => {
    const places = await Place.find({}, { title: 1, _id: 1 });
    res.render("place/index", { places });
  })
);

app.get("/places/create", (req, res) => {
  res.render("place/create");
});

app.post(
  "/places",
  asyncWrap(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect("/places");
  })
);

app.get(
  "/places/:id",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("place/show", { place });
  })
);

app.put(
  "/places/:id",
  asyncWrap(async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    res.redirect("/places");
  })
);

app.delete(
  "/places/:id",
  asyncWrap(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect("/places");
  })
);

app.get(
  "/places/:id/edit",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("place/edit", { place });
  })
);

app.use((err, req, res, nesxt) => {
  const { status = 500, message = "ada kesalahan pada server" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
