import express from "express";

const router = express.Router();
import {
  deleteUserProfile,
  getUserProfile,
  loginUser,
  logout,
  newUser,
  updateUserProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { createDoctor, getAllDoctors } from "../controllers/doctors.js";
import {
  appoint,
  getallAppointments,
  updateAppointments,
} from "../controllers/appointments.js";
import {
  loginValidator,
  registerValidator,
  validateHandler,
} from "../utils/validators.js";

// <ROUTES>

// create new user
router.post("/createUser", registerValidator(), validateHandler, newUser);
router.post("/login", loginValidator(), validateHandler, loginUser);
router.get("/userinfo", isAuthenticated, getUserProfile);
router.get("/logout", isAuthenticated, logout);

// doctor
router.post("/createDoctor", isAuthenticated, createDoctor);
router.get("/searchDoctor", isAuthenticated, getAllDoctors);

//appointments
router.get("/bookDoctor/:id", isAuthenticated, appoint);
router.get("/getAppointments", isAuthenticated, getallAppointments);
router.patch("/updateAppointments/:id", isAuthenticated, updateAppointments);

// update user information
router.patch("/updateUser", isAuthenticated, updateUserProfile);

//delete user account
router.delete("/deleteUser", isAuthenticated, deleteUserProfile);

export default router;
