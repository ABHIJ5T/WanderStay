const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware");
const userController = require("../controllers/user")

//render sign up form // user signup route
router.route("/signup")
.get(userController.renderSignupform)
.post(wrapAsync(userController.signup))

//login form render // login route
router.route("/login")
.get(userController.renderLoginform)
.post(
    saveredirectUrl,
    passport.authenticate("local",{  //actuall login is done by passport this is just the after response
    failureRedirect:"/login",
    failureFlash: true,
}),userController.login)

module.exports= router;

//logout route
router.get("/logout",userController.logout)