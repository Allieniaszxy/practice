const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.find({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please log in instead",
      });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, genSalt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(200).json({
      message: "New User created successfully",
      data: newUser,
    });
  } catch (error) {}
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await userModel.findOne({ email });
    if (userEmail) {
      const checkPassword = await bcrypt.compare(password, userEmail.password);
      if (checkPassword) {
        const token = jwt.sign(
          { _id: userEmail._id },
          process.env.TOKEN_SECRET,
          { expiresIn: "30m" }
        );
        const { password, ...info } = userEmail._doc;
        res.status(200).json({
          message: "User Signed In successfully",
          data: token,
        });
      } else {
        res.status(400).json({
          message: "Incorrect Password",
        });
      }
    } else {
      res.status(400).json({
        message: "Mail not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error signing in user",
      data: error,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const singleUser = await userModel.findById(req.params.userID);
    res.status(200).json({
      message: "SIngle User gotten successfully",
      data: singleUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error getting single user",
      data: error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const getUsers = await userModel.find();
    if (!getUsers || getUsers.length === 0) {
      return res.status(404).json({
        message: "No users found in the database",
        data: [],
      });
    }
    res.status(200).json({
      message: "All users gotten successfully",
      data: getUsers,
    });
  } catch (error) {
    console.error("❌ Error getting users:", error);
    res.status(400).json({
      message: "Error getting all Users",
      data: error,
    });
  }
};

const updateUsers = async (req, res) => {
  try {
    const { userID } = req.params;
    const updates = req.body;
    const update = await userModel.findByIdAndUpdate(userID, updates, {
      new: true,
      runValidators: true,
    });
    if (!update) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: update,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(userID);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  getSingleUser,
  getAllUsers,
  updateUsers,
  deleteUser,
};
