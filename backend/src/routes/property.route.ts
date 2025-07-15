import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  deleteProperty,
  updateProperty
} from "../controllers/property.controller";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate,getAllProperties);
router.get("/:id",authenticate, getPropertyById);
router.post("/new", authenticate, authorizeRoles("admin"), createProperty);
router.put("/:id",authenticate, authorizeRoles("admin"), updateProperty);
router.delete("/:id",authenticate, authorizeRoles("admin"), deleteProperty);

export default router;