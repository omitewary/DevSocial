const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Omi",
    lastName: "Tewary",
    emailId: "ot@gmail.com",
    password: "test@123",
  });

  try {
    await user.save();
    res.send("Data added successfully");
  } catch (error) {
    res.status(500).send("Error saving the user" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7070, () => {
      console.log("server is listening on port 7070");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
