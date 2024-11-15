const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const router = express.Router();

const SAFE_USER_DATA = "firstName lastName gender age about skills";

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", SAFE_USER_DATA);

    res.send({ message: "data fetched successfully", data });
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connectionRequest.map((doc) =>
      doc.fromUserId.equals(loggedInUser._id) ? doc.toUserId : doc.fromUserId
    );
    res.json({ message: "data fetched successfully", data });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = router;
