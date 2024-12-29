const validateSignupData = ({ firstName, emailId, password }) => {
  if (!firstName) {
    throw new Error("first name is required");
  }
  if (!emailId) {
    throw new Error("email is required");
  }
  if (!password) {
    throw new Error("password is required");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "avatar",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = { validateSignupData, validateEditProfileData };
