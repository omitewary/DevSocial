const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/requests");

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

/**/

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
