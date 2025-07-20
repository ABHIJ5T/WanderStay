const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js"); //
const Listing = require("../models/listing.js");
const { isloggedin , isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js")


// Server-side validation for reviews
const validateReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// POST: Create a new review
router.post(
  "/",isloggedin,
  validateReviews,
  wrapAsync(reviewController.createReview)
);

// DELETE: Remove a review
router.delete(
  "/:reviewId",isloggedin,isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
