const express = require("express");
const authenticateUser = require("../utils/authenticateUser");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const requestsRouter = express.Router();

requestsRouter.post(
  "/requests/send/:status/:toUserId",
  authenticateUser,
  async (req, res) => {
    try {
      const { toUserId } = req.params;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      const isValidStatus = allowedStatus.includes(status);

      if (!isValidStatus) {
        throw new Error("invalid status");
      }

      if(fromUserId === toUserId){
        throw new Error("you can't send request to yourself")
      }

      const toUser = await user.findById(toUserId);
      if (!toUser) {
        throw new Error("user not found");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        throw new Error("Request already sent");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ msg: "Request sent successfully", data });
    } catch (error) {
      res.send("Err: " + error);
    }
  }
);

requestsRouter.post('/requests/review/:status/:requestId',authenticateUser,async(req,res)=>{
    try{
        const {status, requestId}=req.params
        const allowedStatus=["accepted","rejected"]
        const isValidStatus=allowedStatus.includes(status)
        if(!isValidStatus){
            throw new Error("invalid status")
        }

        const loggedinUser = req.user

        console.log(loggedinUser._id)

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedinUser._id,
            status:'interested'
        })

        if(!connectionRequest){
            throw new Error("Connection Request not found")
        }

        connectionRequest.status=status
        await connectionRequest.save()
        res.json({msg:"request updated successfully"})

    }catch(error){
        res.send("Err: " + error);
    }
})

module.exports = requestsRouter;
