const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // READ THE TOKEN FROM REQ.COOKIES
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    // validate the token
    const decodedMsg = await jwt.verify(token, "DEV@TINDER876192811");
    const { _id } = decodedMsg;

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Attach the current user to the req
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
