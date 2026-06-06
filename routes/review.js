const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController  = require("../controller/review.js");

//review  post route 
router.post("/", isLoggedIn ,validateReview , wrapAsync (ReviewController.createReview));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));

module.exports = router;