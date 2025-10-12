const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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

// const getSingleUser = async (req, res) => {
//   try {
//   } catch (error) {}
// };

module.exports = { signUp, signIn };
