import { AuthToken } from "../config/config.js";
import { TryCatch, ErrorHandler } from "../utils/tryCatch.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { adminSecretKey } from "../server.js";
dotenv.config();

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies[AuthToken];
  if (!token)
    return next(new ErrorHandler("please login to access this page", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});

//adming authenticator
const adminOnly = (req, res, next) => {
  const token = req.cookies["JarvisToken"];
  if (!token)
    return next(new ErrorHandler("only admin can Access this Route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[AuthToken];
    console.log(authToken);

    if (!authToken)
      return next(new ErrorHandler("please Login to access this Route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);
    if (!user) return next(new ErrorHandler("Invalid User", 401));
    socket.user = user;

    return next();
  } catch (error) {
    return next(new ErrorHandler("please Login to access this Route", 401));
  }
};

export { isAuthenticated, socketAuthenticator, adminOnly };
