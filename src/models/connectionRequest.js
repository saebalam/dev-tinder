const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",  //reference to user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
