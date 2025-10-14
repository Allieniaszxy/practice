const express = require("express");
const userRouter = require("./src/routers/userRoute");
const productRouter = require("./src/routers/productRoute");
const app = express();
require("dotenv").config();
require("./src/config/db");

app.use(express.json());

const port = process.env.PORT || 8989;
app.get("/", (req, res) => {
  res.json({
    message: "Server up and running 🚀",
  });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.listen(port, () => {
  console.log(`Server listening on  PORt: ${port}`);
});
