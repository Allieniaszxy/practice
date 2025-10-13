const express = require("express");
const {
  signUp,
  signIn,
  getAllUsers,
  getSingleUser,
  updateUsers,
  deleteUser,
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.post("/login", signIn);
userRouter.get("/getallusers", getAllUsers);
userRouter.get("/single/:id", getSingleUser);
userRouter.put("/update/:id", updateUsers);
userRouter.delete("/delete/:id", deleteUser);
// userRouter.route("/login").post(signIn);
// userRouter.post("/signup", signUp);

module.exports = userRouter;
