//for server side validation
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),

    image: Joi.alternatives().try(
      Joi.string().uri().allow("", null), // case 1: simple URL
      Joi.object({
        filename: Joi.string().allow("", null).optional(),
        url: Joi.string().uri().allow("", null).optional()
      }).optional()
    ).optional(),
    category: Joi.string().valid(
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Camping",
      "Farms",
      "Mountains",
      "Castle",
      "Artic"
    ).required()
  }).required()
});




module.exports.reviewSchema = Joi.object({
  reviews: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
});
