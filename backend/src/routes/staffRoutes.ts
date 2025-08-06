import { Router } from "express";
import StaffController from "../controllers/StaffController";
import authMiddleware from "../middleware/authMiddleware";
import { verify } from "crypto";

const staffRouter = Router();

staffRouter.get("/most-borrowed", authMiddleware.verifyAdmin, StaffController.getMostBorrowedBooks);
staffRouter.get("/top-active-readers", authMiddleware.verifyAdmin, StaffController.getTopActiveReaders);
staffRouter.get("/low-availability", authMiddleware.verifyAdmin, StaffController.getBooksWithLowAvailability);

export default staffRouter;