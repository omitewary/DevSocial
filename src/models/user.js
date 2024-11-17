const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      password: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter  a strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Social@123");
  return token;
};

userSchema.methods.validatePw = async function (pwInputByUser) {
  const user = this;
  const isPwValid = await bcrypt.compare(pwInputByUser, user.password);
  return isPwValid;
};

userSchema.methods.toLoginResponse = function () {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    emailId: this.emailId,
    skills: this.skills,
    photoUrl: this.photoUrl,
  };
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
