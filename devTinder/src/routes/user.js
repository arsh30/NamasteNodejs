const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "gender",
      "skills",
      "about",
      "photoUrl",
    ]);

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
        "photoUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "about",
        "photoUrl",
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

userRouter.get("/feed", userAuth, async (req, res) => {
  /*
  cases that we need to cover
  1. suppose akshay is loggedIn, to agr jo user interested/ignored krdiya hai already to feed me unki profile dubara nahi dikhni chaiye
  2. akshay is loggedIn, to usko khud ki profile nahi dikhni chaiye
  3. already have connections, (to dubara se feed me kyu dikhana hai)  
  */
  try {
    /*
    user should see all the user cards except
    0. his own card
    1. his connections
    2. ignored people
    3. already sent the connection request

    Example: Rahul a new user signup - currentUser = [Elon, virat, ms dhoni, donald, Akshay], insbki profile rahul ko dikhegi 
    suppose Rahul -> send connection request -> Akshay -> (rejected), and Rahul -> Elon -> Accepted
    then rahul ko feed me visible hogi profiles -> [virat, ms dhoni, donald]

    
    */
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 5 ? 2 : limit;

    const skip = (page - 1) * limit;

    // Find All connections request (sent + recieved)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName") // To Verify ki kisne kisko request bhji hai unke name
    // .populate("toUserId", "firstName");  // Agr already request bhjdi hai toh vo bnde feed me dikhne nhi chiaye

    // console.log("connections", connectionRequests);

    let hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUsersFromFeed); so these are the people which i want to hide from the feed, we used set Set because abhi isme duplicate bhi honge fromUserId and toUserId, and hmko sirf 1 hi chaiye

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // Not in (nin): means vo sare users dedo jo hideuser me nahi hai and jo current user ki bhi profile nai chaiye
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName gender skills about photoUrl")
      .skip(skip)
      .limit(limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
});
module.exports = userRouter;
