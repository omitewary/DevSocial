const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateProfileUpdateData,
  validatePwData,
} = require("../utils/validation");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.send(400).send("ERROR: " + error.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdateData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validatePwData(req)) {
      throw new Error("Invalid edit request");
    }
    const { password } = req.body;
    const hashPw = await bcrypt.hash(password, 10);

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = hashPw));
    await loggedInUser.save();
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send(
        `${loggedInUser.firstName} your password is updated! Please login again with new password`
      );
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = router;
