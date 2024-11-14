const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

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

    const data = await connectionRequest.save();
    res.json({
      message: `${req.user.firstName} ${status}  - ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = router;