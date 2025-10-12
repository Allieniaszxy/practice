const express = require("express");
const { signUp } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.post("/signup", signUp);

module.exports = userRouter;
