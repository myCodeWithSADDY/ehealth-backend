import { ErrorHandler, TryCatch } from "../utils/tryCatch.js";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";

import User from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";

const newUser = TryCatch(async (req, res, next) => {
  const { name, email, number, age, role, password } = req.body;

  const user = await User.create({
    name,
    email,
    number,
    password,
    age,
    role,
  });

  if (user.role === "Doctor") {
    const doctor = await Doctor.create({
      userId: user._id,
      specialization: req.body.specialization,
      fees: req.body.fees,
      appointmentTiming: req.body.appointmentTiming,
      address: req.body.address,
    });
  }
  sendToken(res, user, 201, "user created");
});

//login User
const loginUser = TryCatch(async (req, res, next) => {
  const { email, password, number } = req.body;
  if ((!!email && !!number) || (!email && !number))
    return next(new ErrorHandler("invalid Credentials", 404));

  const user = await User.findOne(email ? { email } : { number }).select(
    "+password"
  );

  if (!user) return next(new ErrorHandler("invalid Credentials", 404));

  const isMatch = await compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("invalid Credentials", 404));

  sendToken(res, user, 201, `Welcome Back ${user.name}`);
});

const getUserProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user).select("-password");
  if (!user) return next(new ErrorHandler("user not found", 404));
  return res.status(200).json({
    success: true,
    user,
  });
});
// update user profile information "/user/profile "  Patch request

const updateUserProfile = TryCatch(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new ErrorHandler("user not found", 404));
  return res.status(200).json({
    success: true,
    user,
  });
});

const deleteUserProfile = TryCatch(async (req, res, next) => {
  // Delete appointments associated with the user
  const dropappointments = await Appointment.deleteMany({ userId: req.user });
  if (dropappointments.deletedCount === 0) {
    return next(new ErrorHandler("No appointments found for this user", 404));
  }

  // Delete the user
  const user = await User.findByIdAndDelete(req.user);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Respond with success
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const logout = TryCatch(async (req, res, next) => {
  res.cookie("Auth-Token", "", { ...cookieOptions, maxAge: 0 }).json({
    success: true,
    message: "You have been logged out",
  });
});

export {
  newUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  logout,
};
