const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://arshdeep:Arshdeep12345@cluster0.gpnfigx.mongodb.net/devTinder"
  );  
};

module.exports = connectDB;
