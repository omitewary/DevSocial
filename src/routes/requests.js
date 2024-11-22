const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  console.log("requet send :", req.user._id);
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    console.log("user:", fromUserId);
    console.log("fromUserId ", fromUserId);
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status type " + status);
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).send({ message: "user not found!" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error(
        `Request exist for ${req.user.firstName} to ${toUser.firstName}`
      );
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    console.log("connectionRequest ", connectionRequest);
    const data = await connectionRequest.save();
    res.json({
      message: `${req.user.firstName} ${status}  - ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: `Invalid status : ${status}` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection request ${status}`, data });
    } catch (error) {
      res.status(400).send("ERROR " + error.message);
    }
  }
);

module.exports = router;
