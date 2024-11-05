const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://omitewary:Welcome%4011011_123@cluster0.jlxhs.mongodb.net/devSocial"
  );
};

module.exports = connectDB;
