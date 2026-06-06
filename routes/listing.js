const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});


const listingController = require("../controller/listing.js");



//new route
router.get("/new",isLoggedIn ,listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))// index route
.post(isLoggedIn ,upload.single("listing[image]"),validateListing,  wrapAsync(listingController.createListing));//create route

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedIn ,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))//update route
.delete(isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing));//delete route

//edit route
router.get("/:id/edit" ,isLoggedIn ,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;