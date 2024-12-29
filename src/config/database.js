const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect("mongodb+srv://saebalam:saebalampassword@cluster0.yms88.mongodb.net/devTinder");
};

module.exports = connectDb;
