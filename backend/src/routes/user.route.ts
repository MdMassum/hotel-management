import express from "express";
import {
  getAllTenants,
  getUserById,
  updateUserStatus,
  deleteUser
} from "../controllers/user.controller";
import { login, logout, signup } from "../controllers/auth.controller";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout",authenticate, logout);

router.get("/tenants", authenticate, authorizeRoles("admin"), getAllTenants);
router.get("/:id",authenticate, authorizeRoles("admin"), getUserById);
router.patch("/:id/status",authenticate, authorizeRoles("admin"), updateUserStatus);
router.delete("/:id",authenticate, authorizeRoles("admin"), deleteUser);

export default router;