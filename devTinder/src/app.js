const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin- we are whitelisting(allowing) this url, to store the cookie for locally and prod pr it will perfectly fine
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("connection is successfully established");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port:3000");
    });
  })
  .catch((error) => {
    console.log("Connection not established");
  });
