const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");
const {
  validateEditProfileData,
  validateEditPasswordField,
} = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //1.  so 1 bar jab signup krliya to hum password ko hash krke store krte hai db me which is impossible to decrypt this
    //2. jab login, kiya to sbse pehle db me dekha ki vo user exist krta hai to get kiya,
    // if yes, and bcytp.compare se password compare kiya and agr password same aaya to 1 new jwt token create kiya using jwt.sign
    // and usko res.cookie me set krwa diya , so ab jabhi koi request aayegi, vo token usme hoga, basically uski id hmne store krli us token me
    // id store hai, so jabhi koi api hit hogi to hume uss user ki details mil jayegi
    // Jabhi koi user login hoga, hmesha uske liye different hogi

    const user = req.user;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      // Do this validation every time when ever the we put any data inside the database
      throw new Error("Invalid Edit Request!!!!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      return (loggedInUser[key] = req.body[key]);
    });

    await loggedInUser.save();

    res.status(201).json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  // forgot password api
  try {
    if (!validateEditPasswordField(req)) {
      throw new Error("please enter password and confirm Password");
    }

    const loggedInUser = req.user;
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
});
module.exports = { profileRouter };
