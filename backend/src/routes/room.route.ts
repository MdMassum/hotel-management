import express from "express";
import {
  createRoom,
  getRoomsByProperty,
  assignRoomToTenant,
  releaseRoom
} from "../controllers/room.controller";

const router = express.Router();

router.post("/", createRoom);
router.get("/property/:propertyId", getRoomsByProperty);
router.post("/assign", assignRoomToTenant);
router.post("/release/:roomId", releaseRoom);

export default router;