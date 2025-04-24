const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    // Now we want the name ki kisne bhji hai from the connectionRequests (fromUserId)
    // so we will use ref in the schema (connectionRequests): Eg:  {
    // fromUserId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User", //This will create reference of fromUserId, with the UserCollection, we can access everything from the User Collections.
    // },

    // Now we have to populate that data

    res.status(201).json({
      message: "Data fetched successfully",
      data: connectRequests,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong " + error.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    /*
    Akshay => Elon =>Accepted
    Elon => Mark => accepted 

    means elon ko pass jo jo bhi aayi hai and elon ne jin jin ko bhji hai

    elon can be from user and toUser
    */
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "about",
      ]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data: data });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong " + error.message,
    });
  }
});
module.exports = userRouter;
