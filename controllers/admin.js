import { adminSecretKey } from "../server.js";
import { cookieOptions } from "../utils/features.js";
import { ErrorHandler, TryCatch } from "../utils/tryCatch.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";
dotenv.config();

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;
  const isMatch = secretKey === adminSecretKey;

  if (!isMatch) return next(new ErrorHandler("invalid Admin key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);
  return res
    .status(200)
    .cookie("JarvisToken", token, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
    .json({
      success: true,
      message:
        "adminToken authentication successful, Welcom to Jarvis control panel",
    });
});

const logoutAdmin = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("JarvisToken", "", { ...cookieOptions, maxAge: 1000 * 60 * 15 })
    .json({
      success: true,
      message: "Jarvis Logging out successfully",
    });
});

const getAdminData = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;
  const isMatch = secretKey === adminSecretKey;
  if (!isMatch) return next(new ErrorHandler("invalid Admin key", 404));
  return res.status(200).json({
    admin: true,
  });
});

const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find().select("-password");

  return res.status(200).json({
    success: true,
    users,
  });
});
const getAllDocs = TryCatch(async (req, res, next) => {
  const users = await Doctor.find().select("-password");

  if (!users) {
    return next(new ErrorHandler("No Doctor found", 404));
  }

  return res.status(200).json({
    success: true,
    users,
  });
});

const getallAppointments = TryCatch(async (req, res, next) => {
  const Appointments = await Appointment.find({ status: { $ne: "Confirmed" } })
    .populate({
      path: "doctorId",
      select: "name specialization fees address appointmentTiming",
      populate: {
        path: "userId",
        select: "name number",
      },
    })
    .populate("userId", "name number");

  if (Appointments.length === 0) {
    return next(new ErrorHandler("No appointments found", 404));
  }

  return res.status(200).json({
    success: true,
    FilteredAppoints: Appointments,
  });
});

const getconfirmedAppointments = TryCatch(async (req, res, next) => {
  const Appointments = await Appointment.find({ status: "Confirmed" })
    .populate({
      path: "doctorId",
      select: "name specialization fees address appointmentTiming",
      populate: {
        path: "userId",
        select: "name number",
      },
    })
    .populate("userId", "name number");

  if (Appointments.length === 0) {
    return next(new ErrorHandler("No Confirmed appointments found", 404));
  }

  return res.status(200).json({
    success: true,
    ConfirmedAppoints: Appointments,
  });
});

const getDashboardStats = TryCatch(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalDoctors = await Doctor.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const totalConfirmedAppointments = await Appointment.countDocuments({
    status: "Confirmed",
  });

  return res.status(200).json({
    success: true,
    totalUsers,
    totalDoctors,
    totalAppointments,
    totalConfirmedAppointments,
  });
});

export {
  adminLogin,
  logoutAdmin,
  getAdminData,
  getAllUsers,
  getAllDocs,
  getallAppointments,
  getconfirmedAppointments,
  getDashboardStats,
};
