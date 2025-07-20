const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient =  mbxGeocoding({ accessToken: mapToken });

// listing route call backs
module.exports.index =async(req,res)=>{
    // res.send("working")
     const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }
    
  // const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings, category}) //passing all the Listing to index.ejs 
                                                              // also pass category to highlight active filter
}

module.exports.renderNewform =(req,res)=>{                                                             
 res.render("listings/new.ejs")                                       
  
}
module.exports.showListing = async(req,res)=>{
  let { id }= req.params ;

 const listing = await Listing.findById(id).populate(
  {path:"reviews", populate:{
    path:"author",
  },
}
  ).populate("owner");
  if(!listing){
    req.flash("error","listing you requested for does not exists");
    res.redirect("/listings")
  }
 
  res.render("listings/show.ejs",{ listing });
}

module.exports.createListings= async (req,res,next)=>{

  let response =  await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
  })
  .send()
  


    //  let {title,description,image,price,location,country}= req.body
    //  let listing = req.body     //we can do like this but we wont we can make a object in new ejs with title  other can be there key
    // console.log("Received Data:", req.body); // Log request body

  //   let result =  listingSchema = validate(req.body);
  // console.log(result);
  // if(result.error){    ///validate schema now will make a middleware for it so comment out
  //  throw new ExpressError(400,result.error)
  // }
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing")
    // }
    let url = req.file.path;
    let filename = req.file.path;
    console.log(url ,"..", filename);
    const newlisting= new Listing(req.body.listing)   //listing object in new.ejs
    newlisting.owner =req.user._id;
    newlisting.image = {url , filename};
    newlisting.geometry = response.body.features[0].geometry;
    let savedListing = await newlisting.save()
    console.log(savedListing)
    req.flash("success","New Listing Created!")
    res.redirect("/listings")
    
}
module.exports.renderEditform = async(req,res)=>{
         let {id}= req.params;
         const listing= await Listing.findById(id);
         if(!listing){
          req.flash("error","listing you requested for does not exists!");
          res.redirect("/listings")
         }
         let originalImageUrl = listing.image.url;
           originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250")   //cloudinery image transaformation parameters
         res.render("listings/edit.ejs",{ listing , originalImageUrl})
}
module.exports.updateListing = async (req,res)=>{

   let { id } = req.params;
  
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
   
   if( typeof req.file !== "undefined" ){
    let url = req.file.path;
    let filename = req.file.path;
    listing.image = {url,filename};
    await listing.save();
   }
    req.flash("success","listing updated");
  
   res.redirect(`/listings/${id}`);
}
module.exports.deleteListing= async (req,res)=>{
  let { id } = req.params
  let deletedlisting = await Listing.findByIdAndDelete(id)
  console.log(deletedlisting);
   req.flash("success","Listing deleted!")
   res.redirect("/listings")
}


module.exports.searchListing = async(req,res)=>{
const { query } = req.query;

if(!query){
  return res.redirect("/listings")
} 
try{
  const listings = await Listing.find({
    $or:[
      {title:{$regex: query, $options : 'i'}},
      {location:{$regex: query, $options : 'i'}},
    ]
  });
    
   res.render('listings/index', { allListings: listings, category: null });
}catch (err) {
    console.error('Search Error:', err);
    res.status(500).send('Something went wrong.');
} };