const express = require("express");
const {
  newProduct,
  getAllProduct,
  getOneProduct,
  getUserProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { productUpload } = require("../config/multer");
const productRouter = express.Router();

productRouter.post("/newproduct/:productUserID", productUpload, newProduct);
productRouter.get("/getallproduct", getAllProduct);
productRouter.get("/getoneproduct/:id", getOneProduct);
productRouter.get("/getuserproduct/:userID", getUserProduct);
productRouter.put("/update/:id", productUpload, updateProduct);
productRouter.delete("/delete/:id/:userID", deleteProduct);

module.exports = productRouter;
