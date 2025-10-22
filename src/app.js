const express = require("express");
const userRouter = require("./routers/userRoute");
const productRouter = require("./routers/productRoute");
const app = express();
const appRouter = express.Router();
app.use(express.json());

// appRouter.route("/users", userRouter);
// app.use("/api/products", productRouter);
appRouter.use("/users", userRouter);
appRouter.use("/products", productRouter);

module.exports = appRouter;
