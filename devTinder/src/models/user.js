const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // now we make this firstName is mandatory, if the client will not passed, then the entry will not be stored
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // isse duplicate emailId wali jo bhi entries hongi vo store nahi hongi
      lowerCase: true, // bydefault db me ye lowercase me store hoga
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not correct: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your Password is not strong: " + value);
        }
      },
    },
    age: {
      type: String,
      min: 18,
    },
    gender: {
      type: String,
      // if we want to add custom validation,
      // this validate function will run whenever we insert the new document,
      // but when we update this existing user, then it will not run,
      // so before putting value this method will run , and if the result is true then it only insert the Id into it.

      // But if we want to update the existing user , and we want to run this validators functions,
      // then we need to explicitly add runValidators in the api options (patch api )
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("PhotoUrl is not correct: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
    // so jbhi user create krege to ye add hojayegi, field createdAt, updatedAt
    // so jb kisi user ko update krege toh uska date time change hojayega
  }
);

userSchema.methods.getJWT = async function () {
  // Note: always use normal function, because in arrow function this method will not work
  // WE ARE ATTACHING THIS GETJWT METHOD WITH EVERY USER IN DB WHOSOEVER LOGIN
  // THIS MAKES OUR CODE MORE CLEANER, TESTABLE, AND GOOD WAY

  const user = this; // this (basically jo user create hua hai db me uski ID lera hai, (OVERALL INSTANCE JO CREATE HUA HAI USKI ID LERA HAI))
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER876192811", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordEnterByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordEnterByUser,
    hashPassword
  );
  return isPasswordValid;
};

// NOTE: These schema method are very closely to user model,eg: in jwt sign=we are using userId and similarly for validatePassword 
// which is specific to the user

// Now we create a mongooseModel
const User = mongoose.model("User", userSchema);
module.exports = User; // jisme store krre hai always should be in capital letter, we will create instance of this model
