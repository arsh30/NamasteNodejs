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

      res.status(200).json({
        message: `${req.user.firstName} is ${status} in : ${toUser.firstName}`,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, // jo Object create hua hai basically when we create the ID
        toUserId: loggedInUser._id, // jisko bhji hai request vo loggedIn hona chaiye
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection Request Not Found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(201).json({
        message: "Connection Request " + status,
        data,
      });

      /*
      1. always whenever write the logic for api calls, make sure to cover all the corner cases, in your head, you are clear, 
      what you are going to write. and have you cover the corner cases as well.

      0) validate the status
      Eg: akshay send the connection request to elon
      1.1) Is Elong loggedIn user (because akshay ne send kri thi elon ko to elon reviw krra hai) (loggedIN = toUserId) 
      1.2) status  = interested (ignored ke case me kuch nahi kar skte, means vo undo nahi hoga)
      1.3) requestID should be valid

      */
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = { requestRouter };
