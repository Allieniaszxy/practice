const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "djt8nqjiy",
  api_key: "393568221654576",
  api_secret: "GU4-xbG1GTyhQnLUkT2-xsiqvbU",
  secure: true,
});

module.exports = cloudinary;
