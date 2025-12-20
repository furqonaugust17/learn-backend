const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().min(3).required(),
  }).required(),
});
