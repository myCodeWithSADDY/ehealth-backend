import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";
import { ErrorHandler, TryCatch } from "../utils/tryCatch.js";

// Create Appointment
const appoint = TryCatch(async (req, res, next) => {
  const { id: doctorId } = req.params; // Doctor ID from params
  const { appointmentDate } = req.body; // Appointment date from body
  const userId = req.user; // User ID from authenticated middleware

  // Check if the doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  // Validate appointment date
  const currentDateTime = new Date();
  const normalizedAppointmentDate = new Date(appointmentDate);
  if (normalizedAppointmentDate <= currentDateTime) {
    return res.status(400).json({
      success: false,
      message: "The selected appointment date is invalid",
    });
  }

  // Check for conflicting appointments
  const existingAppointment = await Appointment.findOne({
    doctorId,
    appointmentDate: normalizedAppointmentDate,
    status: { $ne: "Cancelled" }, // Exclude cancelled appointments
  });

  if (existingAppointment) {
    return res.status(400).json({
      success: false,
      message: "The doctor is already booked at this time",
    });
  }

  // Create the new appointment
  const newBooking = await Appointment.create({
    doctorId,
    userId,
    appointmentDate: normalizedAppointmentDate,
    status: "Pending", // Default status
  });

  return res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: {
      booking: newBooking,
    },
  });
});

const getallAppointments = TryCatch(async (req, res, next) => {
  const appoints = await Appointment.find({ userId: req.user })
    .populate("doctorId", "name specialization")
    .populate("userId", "name email");
  if (appoints.length === 0)
    return next(new ErrorHandler("Appointment not found", 404));
  return res.status(200).json({
    success: true,
    appoints,
  });
});

const updateAppointments = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const { appointmentDate, status } = req.body;

  const existingAppointment = await Appointment.findById(id);
  if (!existingAppointment)
    return next(new ErrorHandler("Appointment not found", 404));
  if (existingAppointment.userId.toString() !== userId.toString())
    return next(
      new ErrorHandler("Unauthorized to update this appointment", 403)
    );
  if (status === "Cancelled" && existingAppointment.status === "Cancelled")
    return next(new ErrorHandler("Appointment is already cancelled", 400));
  if (status === "Cancelled" && existingAppointment.status === "Completed")
    return next(new ErrorHandler("Cannot cancel completed appointment", 400));
  existingAppointment.appointmentDate = appointmentDate;
  existingAppointment.status = status;
  existingAppointment.save();
  return res.status(200).json({
    success: true,
    message: "Appointment updated successfully",
    data: existingAppointment,
  });
});

export { appoint, getallAppointments, updateAppointments };
