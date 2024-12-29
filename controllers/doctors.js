import Doctor from "../models/doctor.js";
import User from "../models/user.js";
import { ErrorHandler, TryCatch } from "../utils/tryCatch.js";

const createDoctor = TryCatch(async (req, res, next) => {
  const { userId, appointmentTiming, specialization } = req.body;
  const findUser = await User.findById(userId);
  if (findUser.role !== "Doctor")
    return next(new ErrorHandler("Please Select The Doctor Role First", 404));

  const doctor = await Doctor.create({
    userId,
    address,
    appointmentTiming,
    fees,
    specialization,
  });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: { doctor },
  });
});

const getAllDoctors = TryCatch(async (req, res, next) => {
  const { specialization } = req.query;

  const filter = specialization ? { specialization } : {};
  const doctors = await Doctor.find(filter);

  if (!doctors) return next(new ErrorHandler("Doctor not found", 404));

  res.status(200).json({
    success: true,
    data: { doctors },
  });
});

export { createDoctor, getAllDoctors };
