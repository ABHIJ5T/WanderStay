if(process.env.NODE_ENV !="production"){
require("dotenv").config();   //cause we dont want to upload this file when we deploy or produce the website
}

console.log(process.env.secret)

const express = require("express");
const mongoose=  require("mongoose");
const app = express();
const path= require("path")
const methodOverride= require("method-override")
const ejsmate = require("ejs-mate")
const ExpressError= require("./utils/ExpressError")
const session= require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const  User = require("./models/user.js")

const reviewRouter = require("./routes/reviews.js")
const listingRouter = require("./routes/listing.js")
const userRouter = require("./routes/user.js");
const { error } = require("console");

// const mongo_url="mongodb://127.0.0.1:27017/wanderstay" //local
  const dbUrl = process.env.ATLASDB_URL                  //cloud 

main().then(()=>{      //calling main functionn
    console.log("connected to db")
})
.catch((err)=>{
 console.log(err)
});
async function main(){
    await mongoose.connect(dbUrl);    //clouddatabase connection
                                    // mongo_url local database connection
}  
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // to parse the data from req
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"))
app.engine("ejs", ejsmate)


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
})

store.on("error",(req,res)=>{
 console.log("error in mongo session store", err)
})

const sessionOptions = {
    store,                           //session info storing in atlas mdb
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, //adding expiry dates to cookies
        maxAge : 7*24*60*60*1000
    },
    httpOnly:true
}





// app.get("/",(req,res)=>{
//     res.send("you are on root route")
//    })

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use( new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user ;
    next();
})

// app.get("/demouser", async(req,res)=>
// {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//    let registeredUser= await User.register(fakeUser,"helloworld")
//    res.send(registeredUser)
// })

// listing
app.use("/listings",listingRouter);    // using listing object for route where ever the common route is common it will pass listing variables object and that imports the listing routes
//reviews
app.use("/listings/:id/reviews", reviewRouter);
//user
app.use("/",userRouter);
// app.get("/testinglisting", async(req,res)=>{
//                            // creating a testing sample document
//   let sampleListing = new listing(
//     {
//         title:"my new villa",
//         description:"by the beach",
//         price: 1200,
//         location:"calangute goa",
//         country:"india"
//     }
//   )
 
//  await sampleListing.save();

//  console.log("sample was saved");
//  res.send("succesfull testing");

// })

// error handling/ error middleware
app.all("*",(req,res,next)=>{   // * matches with all the incoming requests
   next(new ExpressError(404,"page not found!"))
})



app.use((err,req,res,next)=>{
  let{statuscode=500,message="something went wrong"} = err ;
   res.status(statuscode).render("error.ejs",{message})
   //  res.status(statuscode).send(message);
})

app.listen(8080,()=>{
    console.log("listening to port 8080");
})

