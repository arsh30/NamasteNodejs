const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status Type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Adding the Index in this
// Eg: ConnectionRequest.find({fromUserId:12u1u29921, toUserId: uu1921923878273823})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // Added compound Index (means 2 cheezo par lagana ho)

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // check if the fromUserId and sendUserid is same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("can not send connection request to yourself");
  }
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
