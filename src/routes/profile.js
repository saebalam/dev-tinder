const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validator = require("validator");
const authenticateUser = require("../utils/authenticateUser");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Err: " + error);
  }
});

profileRouter.patch("/profile/edit", authenticateUser, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid fields");
    }
    const user = req.user;
    Object.keys(req.body)?.forEach((key) => (user[key] = req.body[key]));
    const updateUser = await user.save();
    // res.send("User updated successfully");
    res.json({ msg: "Profile Updated Successfully", data: updateUser });
  } catch (error) {
    res.status(400).send("Err: " + error);
  }
});

profileRouter.patch("/profile/edit/password", authenticateUser, async (req, res) => {
  try {
    console.log('11111',req.body)
    const {newPassword} = req.body
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Weak password")
    }
    const user = req.user;
    user.password = newPassword
    const updateUser = await user.save();
    res.json({ msg: "Password Updated Successfully", data: updateUser });
  } catch (error) {
    res.status(400).send("Err: " + error);
  }
});

module.exports = profileRouter;
