const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = async (req, res,next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Please login again");
    }

    const { id } = jwt.verify(token, "secret");
    const user = await User.findById(id);
    if(!user){
        throw new Error("user not found")
    }
    req.user = user;
    next()
  } catch (error) {
    res.status(400).send("Err: " + error);
  }
};

module.exports = authenticateUser;
