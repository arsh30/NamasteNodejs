const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please Enter Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("EmailId is not valid");
  } else if (!validator.isStrongPassword) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateEditPasswordField = (req) => {
  const allowedField = ["password", "confirmPassword"];
  const isEditPasswordAllowed = Object.keys(req.body).every((field) =>
    allowedField.includes(field)
  );

  return isEditPasswordAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPasswordField,
};
