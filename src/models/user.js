const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender must be male,female or other");
        }
      },
    },
    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public/35",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ id: user._id }, "secret", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = function () {
    const user = this;
  
    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: "1d",
    });
  
    return token;
  };

module.exports = mongoose.model("User", userSchema);
