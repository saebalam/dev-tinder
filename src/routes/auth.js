const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    avatar,
    skills,
  } = req.body;

  try {
    validateSignupData({ firstName, emailId, password });
    // const passwordHash = await bcrypt.hash(password, 10); bcrypt not working
    const passwordHash = password;
    const user = new User({
      firstName,
      emailId,
      password: passwordHash,
    });
    await user.save(user);
    res.send("user saved");
  } catch (error) {
    res.status(400).send("Err " + error);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) {
      throw new Error("email and password is required");
    } else {
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("credentials not match");
      }

      const passwordHash = user.password;

      if (passwordHash !== password) {
        throw new Error("credentials not match");
      } else {
        const token = await user.getJWT();
        res.cookie("token", token).send("login success");
      }
    }
  } catch (error) {
    res.status(400).send("Err: " + error);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("logout success");
  } catch (error) {
    res.status(400).send("Err: " + error);
  }
});

module.exports = authRouter;
