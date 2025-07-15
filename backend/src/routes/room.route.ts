import express from "express";
import {
  createRoom,
  getRoomsByProperty,
  assignRoomToTenant,
  releaseRoom,
  getAllRooms,
  updateRoom,
  deleteRoom
} from "../controllers/room.controller";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/new",authenticate, createRoom);
router.get("/",authenticate, getAllRooms);
router.get("/property/:propertyId",authenticate, getRoomsByProperty);
router.post("/assign",authenticate, assignRoomToTenant);
router.post("/release/:roomId",authenticate, releaseRoom);

router.put('/:id',authenticate,authorizeRoles("admin"),updateRoom)
router.delete('/:id',authenticate,authorizeRoles("admin"),deleteRoom)

export default router;