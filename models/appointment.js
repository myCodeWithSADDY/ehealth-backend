import mongoose from "mongoose";
import Counter from "./counter.js";

const appointmentSchema = new mongoose.Schema(
  {
    appointId: {
      type: String,
      unqiue: true,
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
async function getNextSequenceValue(userId, doctorId) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { userId, doctorId },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

appointmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const sequenceValue = await getNextSequenceValue(
      this.userId,
      this.doctorId
    );
    this.appointId = `APPOINT${sequenceValue.toString().padStart(5, "0")}`;
  }
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
