const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const newProduct = async (req, res) => {
  try {
    const { productName, quantity, price, description } = req.body;

    const cloudImage = await cloudinary.uploader.upload(req.file.path);
    const getUser = await userModel.findById(req.params.productUserID);

    const postProduct = await new productModel({
      productName,
      quantity,
      price,
      description,
      productImage: cloudImage.secure_url,
      productImageID: cloudImage.public_id,
    });

    postProduct.productOwner = getUser;
    postProduct.save();

    getUser.product.push(new mongoose.Types.ObjectId(postProduct._id));
    getUser.save();

    res.status(201).json({
      message: "New Product added successfully",
      data: postProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add new product",
      data: error,
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
    const { id } = req.params;
    const { productName, quantity, price, description } = req.body;

    //check if the  product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    //if a new image was uploaded, replace it on cloudinary
    if (req.file) {
      //delete old image from cloudinary
      await cloudinary.uploader.destroy(product.productImageID);
      //upload new image
      const newImage = await cloudinary.uploader.upload(req.file.path);

      product.productImage = newImage.secure_url;
      product.productImageID = newImage.public_id;
    }
    // update product details
    product.productName = productName || product.productName;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    product.description = description || product.description;

    //save the updated product

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product",
      data: error,
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
