const express = require("express");
const bcrypt = require("bcrypt");
const validators = require("validator");

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //1. data validate
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // 10 is basically a salt, jitne jyda round honge utna tough hoga password
    // - make sure agr 1 bar password hash hogya to its almost impossible decrypt the password again

    // 2. Encrypt password
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(200).send("user added successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validators.isEmail(emailId)) {
      throw new Error("EmailId is wrong");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT Token - (npm i jsonwebtoken)
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
      // benefit of expiring the cookie, to make the application more secure, if some one forgot to
      // logout from the device it automatically logout
      res.status(201).send("login successful!!!");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send();
});
module.exports = { authRouter };
