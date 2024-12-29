import express from "express";
import {
  adminLogin,
  getallAppointments,
  getAllDocs,
  getAllUsers,
  getconfirmedAppointments,
  getDashboardStats,
  logoutAdmin,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../utils/validators.js";
import { adminOnly, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/verify", adminLoginValidator(), validateHandler, adminLogin);
router.get("/logout", logoutAdmin);

router.get("/users", adminOnly, getAllUsers);
router.get("/doctors", adminOnly, getAllDocs);
router.get("/appointments", adminOnly, getallAppointments);
//appointments who status is confirmed
router.get("/confirmedAppointments", adminOnly, getconfirmedAppointments);
router.get("/adminstats", adminOnly, getDashboardStats);

export default router;
