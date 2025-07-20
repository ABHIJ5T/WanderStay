const express= require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError= require("../utils/ExpressError")
const { listingSchema , reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js");
const {isloggedin,isOwner} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

//server side validation for listing
const validatelisting=(req,res,next)=>{
  
    let {error} =  listingSchema.validate(req.body);
   
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",") 
     throw new ExpressError(400,errMsg)
    } else {
      next();
    }
  
  }

//search route
router.get("/search",wrapAsync(listingController.searchListing))
  
//index/create route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedin, upload.single('listing[image]'),validatelisting,wrapAsync(listingController.createListings))

// app.get("/listings", async (req, res) => {
//   try {
//       const allListings = await Listing.find({});
//       console.log("All Listings from DB:", allListings); // Debugging
//       res.render("listings/index.ejs", { allListings });
//   } catch (err) {
//       console.error("Error fetching listings:", err);
//       res.status(500).send("Internal Server Error");
//   }
// });
//create route

// app.post("/listings", async (req, res) => {
//   try {
//       console.log("Received Data:", req.body); // Debugging: Log incoming data
//       const newlisting = new Listing(req.body.listing); // Create a new listing
//       await newlisting.save(); // Save to MongoDB
//       console.log("Saved to DB:", newlisting); // Debugging: Log saved data
//       res.redirect("/listings"); // Redirect after saving
//   } catch (error) {
//       console.error("Error saving to DB:", error); // Debugging: Log any errors
//       res.status(500).send("Failed to save listing. Please try again."); // Send a response
//   }
// });


//new route
router.get("/new",isloggedin,listingController.renderNewform)



// show / read  route
router.get("/:id", wrapAsync(listingController.showListing))


// edit route
router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingController.renderEditform))
//update
router.put("/:id",isloggedin,isOwner,upload.single('listing[image]'), validatelisting, wrapAsync(listingController.updateListing));
//delete
router.delete("/:id",isloggedin,isOwner,wrapAsync(listingController.deleteListing))



module.exports = router;