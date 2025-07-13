import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  deleteProperty
} from "../controllers/property.controller";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate,getAllProperties);
router.get("/:id",authenticate, getPropertyById);
router.post("/", authenticate, authorizeRoles("admin"), createProperty);
router.delete("/:id",authenticate, authorizeRoles("admin"), deleteProperty);

export default router;