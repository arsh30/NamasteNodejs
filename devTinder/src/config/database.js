const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://arshdeep30:Arshdeep123321@cluster0.gpnfigx.mongodb.net/devTinder"
  );  
};

module.exports = connectDB;
