const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = { requestRouter };
