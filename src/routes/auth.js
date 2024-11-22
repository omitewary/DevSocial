const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignupData(req);
    const hashPw = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPw,
    });

    const isPwValid = await user.validatePw(password);
    if (isPwValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
    }

    const data = await user.save();
    res.json({ message: "User added successfully", data: data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    const isPwValid = await user.validatePw(password);
    if (isPwValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.json({ message: "Login Successfull", data: user.toLoginResponse() });
    } else {
      return res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

router.get("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout Successfull");
});

module.exports = router;
