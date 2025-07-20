// const mongoose= require("mongoose")
// const initData = require("./data")
// const  Listing = require("../models/listing")


// const mongo_url="mongodb://127.0.0.1:27017/wanderstay"

// main().then(()=>{      //calling main functionn
//     console.log("connected to db")
// })
// .catch((err)=>{
//  console.log(err)
// });
// async function main(){
//     await mongoose.connect(mongo_url);
// }
 
// const initDB= async()=>{
// await Listing.deleteMany({});
// await Listing.insertMany(initData.data);
// console.log("data was intialized")
// }

// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data= initData.data.map((obj) =>({...obj,owner:"68690a803815b80283485e9c"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();