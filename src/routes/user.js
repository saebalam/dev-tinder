const express = require("express");
const authenticateUser = require("../utils/authenticateUser");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills";

userRouter.get(
  "/user/requests/received",
  authenticateUser,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      console.log(loggedinUser._id);
      const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedinUser._id,
        status: "interested",
      }).populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "skills",
      ]);

      // console.log('conections',connectionRequest)
      res.json({
        msg: "requests fetched successfully",
        data: connectionRequest,
      });
    } catch (error) {
      res.send("Err: " + error);
    }
  }
);

userRouter.get("/user/connections", authenticateUser, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedinUser._id, status: "accepted" },
        { fromUserId: loggedinUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((item) => {
      if (loggedinUser._id.toString() === item.fromUserId._id.toString()) {
        return item.toUserId;
      } else {
        return item.fromUserId;
      }
    });

    res.json({ msg: "requests fetched successfully", data: data });
  } catch (error) {
    res.send("Err: " + error);
  }
});

userRouter.get("/user/feed", authenticateUser, async (req, res) => {
  const loggedinUser = req.user;
  const page = req.query.page || 0;
  let limit = req.query.limit || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  const connnectionmRequests = await ConnectionRequest.find({
    $or: [{ toUserId: loggedinUser._id }, { fromUserId: loggedinUser._id }],
  });
  const hideUsersFromFeed = new Set();
  connnectionmRequests.forEach((item) => {
    hideUsersFromFeed.add(item.fromUserId);
    hideUsersFromFeed.add(item.toUserId);
  });

  const feed = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      { _id: { $ne: loggedinUser._id } },
    ],
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

  res.json({ msg: "feed fetched successfully", data: feed });
});

module.exports = userRouter;
