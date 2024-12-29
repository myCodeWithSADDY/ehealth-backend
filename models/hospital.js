import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  hospitalInfor: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    requied: true,
  },
  facilities: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("HospitalDetails", hospitalSchema);
