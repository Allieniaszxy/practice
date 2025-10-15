const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

const newProduct = async (req, res) => {
  try {
    console.log("🟢 req.file:", req.file);
    console.log("🟢 req.body:", req.body);
    console.log("🟢 req.params:", req.params);
    const { productName, quantity, price, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const path = req.file.path.replace(/\\/g, "/");
    const cloudImage = await cloudinary.uploader.upload(path);
    console.log("cloudinary upload result:", cloudImage);
    fs.unlinkSync(req.file.path);
    const getUser = await userModel.findById(req.params.productUserID);

    if (!getUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const postProduct = new productModel({
      productName,
      quantity,
      price,
      description,
      productImage: cloudImage.secure_url,
      productImageID: cloudImage.public_id,
      productOwner: getUser._id,
    });

    postProduct.productOwner = getUser;
    await postProduct.save();

    getUser.product.push(new mongoose.Types.ObjectId(postProduct._id));
    await getUser.save();

    res.status(201).json({
      message: "New Product added successfully",
      data: postProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add new product",
      error: error.message,
      stack: error.stack,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const getProduct = await productModel.find();
    res.status(200).json({
      message: "All products gotten successfully",
      data: getProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get all product",
      data: error,
    });
  }
};

const getUserProduct = async (req, res) => {
  try {
    const userProduct = await userModel
      .findById(req.params.userID)
      .populate("product");

    res.status(200).json({
      message: "User product gotten successfully",
      data: userProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get user product",
      data: error,
    });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const getOne = await productModel.findById(req.params.id);
    res.status(200).json({
      message: "Product gotten successfully",
      data: getOne,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get one product",
      data: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("🟢 req.params:", req.params);
    console.log("🟢 req.body:", req.body);
    console.log("🟢 req.file:", req.file);

    const { id } = req.params;
    const { productName, quantity, price, description } = req.body || {};

    if (!req.body) {
      return res.status(400).json({
        message: "Request body missing. Did you send form-data?",
      });
    }
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      console.log("🟢 Replacing old image on Cloudinary...");
      await cloudinary.uploader.destroy(product.productImageID);
      const newImage = await cloudinary.uploader.upload(req.file.path);
      product.productImage = newImage.secure_url;
      product.productImageID = newImage.public_id;
    }

    product.productName = productName || product.productName;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    product.description = description || product.description;

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(400).json({
      message: "Error updating product",
      error: error.message,
      stack: error.stack,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id, userID } = req.params;

    //find the product
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    //delete image from cloudinary
    await cloudinary.uploader.destroy(product.productImageID);

    //delete product from db
    await productModel.findByIdAndDelete(id);

    //also remove product reference from user's product array
    const user = await userModel.findById(userID);
    if (user) {
      user.product.pull(id);
      await user.save();
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting successfully",
      data: error,
    });
  }
};

module.exports = {
  newProduct,
  getAllProduct,
  getUserProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
