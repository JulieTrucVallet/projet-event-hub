import { Router } from "express";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "../../controllers/v1/event.controller";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export { router as EventRoute };

