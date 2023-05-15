const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.zv0ej.mongodb.net/MERN_TODO?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("✅ MongoDB connected 🗄️");
      }
    );
  } catch (error) {
    console.log("🚫 =>", error.message);
  }
};

module.exports = connectDB;
