const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cookieParser = require("cookie-parser");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestsRouter)
app.use('/',userRouter)


app.get('/', (req, res) => {
    res.send("hello world")
})



app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("error geting feed");
  }
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.emailId;
    const user = await User.findOne({ emailId: email });
    if (!user) {
      res.send("user not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("error geting user");
  }
});


app.patch("/user", async (req, res) => {
    try {
      const id = req.body.userId;
      const data = req.body
      await User.findByIdAndUpdate({ _id: id },data,{
        returnDocument: "after",
        runValidators: true 
      });
      res.send("user updated");
    } catch (error) {
      res.status(400).send("error updating user");
    }
  });

connectDb()
  .then(() =>
    app.listen(3002, () => {
      console.log("db connected");
      console.log("server running on 3002");
    })
  )
  .catch((err) => console.log(err));
