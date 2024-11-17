const express = require("express");
var cors = require("cors");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

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
