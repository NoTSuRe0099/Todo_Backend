const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const connectDB = require("./config/db");

const app = express(); //? funtion exp
dotenv.config({ path: "./config/config.env" })

app.use(cors())
//? Configs ---->
connectDB(); //* Connect to MongoDB

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", usersRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port 5000`);
}
);

