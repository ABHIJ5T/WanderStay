const User = require("../models/user");

module.exports.renderSignupform = (req,res)=>{
   res.render("users/signup.ejs")
}

module.exports.signup = async (req,res)=>{
    try{
 let {username,email,password} = req.body;
  const newUser = new User({username,email})
  const registereduser = await User.register(newUser, password)
  console.log(registereduser);
  req.login(registereduser,(err)=>{    //passport method login just like logout method automatically logs in the user after sign up
  if (err){
    return next(err)
  }
  req.flash("success","welcome to wanderstay");
  res.redirect("/listings")
  });
    } catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginform = (req,res)=>{
 res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{ //actuall login is done by passport this is just the after response
 req.flash("success","welcome back to wanderlust, you are logged in successfully!!")
 let redirectUrl= res.locals.redirectUrl || "/listings";
 res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
   req.logout((err)=>{    //passport method
    if(err){
        return next(err);
    };
    req.flash("success","you are logged out")
    res.redirect("/listings")
   })

}