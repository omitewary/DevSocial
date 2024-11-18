const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const router = express.Router();

const SAFE_USER_DATA = "firstName lastName gender age about skills photoUrl";

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

router.get("/user/feeds", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
});

module.exports = router;
