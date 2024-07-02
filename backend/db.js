const mongoose = require('mongoose');
const Admin=require("./models/admin_model")
const uri = "mongodb+srv://admin:likith123@cluster0.bouik5b.mongodb.net/codebuilders?retryWrites=true&w=majority&appName=Cluster0";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, connectionParams);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
};

module.exports = { connectDB};