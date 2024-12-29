import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the User collection
      required: true,
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor", // Reference to the Doctors collection
      required: true,
    },
    sequence_value: {
      type: Number,
      default: 0, // Starting sequence value
    },
  },
  { timestamps: true }
);

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
