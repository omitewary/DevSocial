const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello test");
});

app.use((req, res) => {
  res.send("Hello from server");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});