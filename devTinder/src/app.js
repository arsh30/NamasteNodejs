const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const validators = require("validator");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/authMiddleware");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //console.log(req.body); // but we will not able to read this, because body me text aa raha hai, so to read this, we need middleware that conver JSON to JS object ie express.json()

    //1. data validate
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // 10 is basically a salt, jitne jyda round honge utna tough hoga password
    // - make sure agr 1 bar password hash hogya to its almost impossible decrypt the password again

    // 2. Encrypt password
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(200).send("user added successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validators.isEmail(emailId)) {
      throw new Error("EmailId is wrong");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT Token - (npm i jsonwebtoken)
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
      // benefit of expiring the cookie, to make the application more secure, if some one forgot to
      // logout from the device it automatically logout
      res.status(201).send("login successful!!!");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    //1.  so 1 bar jab signup krliya to hum password ko hash krke store krte hai db me which is impossible to decrypt this
    //2. jab login, kiya to sbse pehle db me dekha ki vo user exist krta hai to get kiya,
    // if yes, and bcytp.compare se password compare kiya and agr password same aaya to 1 new jwt token create kiya using jwt.sign
    // and usko res.cookie me set krwa diya , so ab jabhi koi request aayegi, vo token usme hoga, basically uski id hmne store krli us token me
    // id store hai, so jabhi koi api hit hogi to hume uss user ki details mil jayegi
    // Jabhi koi user login hoga, hmesha uske liye different hogi

    const user = req.user;
    res.status(201).send(user);
  } catch (error) {
    console.log("Error: " + error.message);
  }
});

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
