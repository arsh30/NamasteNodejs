const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status Type");
      }

      //  2. jisko bhjni hai vo hmare db me hai bhi
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found");
      }
      
      const existingRequests = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequests) {
        throw new Error("Requests already Exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      console.log("data", data);

      res.status(200).json({
        message: `${req.user.firstName} is ${status} in : ${toUser.firstName}`,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = { requestRouter };
