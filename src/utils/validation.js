const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (
    [firstName, lastName, emailId, password].some(
      (field) => field === undefined || field === null
    )
  ) {
    throw new Error("Missing mandatory field");
  } else if (!firstName || !lastName) {
    throw new Error("First name or Last name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateProfileUpdateData = (req) => {
  const editableFields = [
    "firstName",
    "lastName",
    "skills",
    "photoUrl",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    editableFields.includes(field)
  );
  return isEditAllowed;
};

const validatePwData = (req) => {
  const editableFields = ["password"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    editableFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateProfileUpdateData,
  validatePwData,
};
