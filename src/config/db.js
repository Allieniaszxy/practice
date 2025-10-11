const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
mongoose.connection
  .on("open", () => {
    console.log("Connected to Database");
  })
  .once("error", () => {
    console.log("Failed to connect to Database");
  });

module.exports = mongoose;
