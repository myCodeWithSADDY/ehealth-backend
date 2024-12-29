import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    appointmentTiming: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Example: Validate format "9:00 AM - 5:00 PM"
          const regex = /^\d{1,2}:\d{2} [AP]M - \d{1,2}:\d{2} [AP]M$/;
          return regex.test(value);
        },
        message:
          "Appointment timing must follow the format '9:00 AM - 5:00 PM'",
      },
    },
    fees: {
      type: Number, // Change to number for better handling
      required: true,
      min: [0, "Fees must be a positive number"],
    },
    specialization: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
