
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const user = require("./user.js");
const { required } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename:String
    // filename: {
    //   type: String,
    //   default: "listingimage",
    // },
    // url: {
    //   type: String,
    //   default: "https://unsplash.com/photos/two-palm-trees-are-silhouetted-against-the-setting-sun-G-wNGlsATp0",
    //   set: (v) =>
    //     v === " " || !v
    //       ? "https://unsplash.com/photos/two-palm-trees-are-silhouetted-against-the-setting-sun-G-wNGlsATp0"
    //       : v,
    // },
},
  price: {type:Number,required:true},
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,   //in indiviual item storing object of reviews
      ref: "Review"
    }
  ],
  owner :{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type:String,
    enum: ["Mountains","Artic","Trending","Iconic Cities","Camping","Farms","Castle"],
    required: true
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
  }
   
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;   