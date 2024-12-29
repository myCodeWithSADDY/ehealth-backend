import { body, oneOf, validationResult } from "express-validator";
import { ErrorHandler } from "./tryCatch.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMsg = errors
    .array()
    .map((error) => error.msg)
    .join(", ");
  console.log(errorMsg);
  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMsg, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("number", "Please Enter mobile Number").notEmpty(),
  body("age", "Please Enter Your Age").notEmpty(),
  body("email", "Please Enter Email").notEmpty().isEmail(),
  body("password", "Please Enter Password").notEmpty(),
];
const loginValidator = () => [
  oneOf(
    [
      body("number", "Please Enter mobile Number").notEmpty(),
      body("email", "Please Enter Email").notEmpty().isEmail(),
    ],
    "Please enter either mobile number or email"
  ),

  body("password", "Please Enter Password").notEmpty(),
];

const adminLoginValidator = () => [
  body("secretKey", "Please provide Secret Key").notEmpty(),
];

export {
  loginValidator,
  registerValidator,
  validateHandler,
  adminLoginValidator,
};
