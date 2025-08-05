import { Router } from "express";
import BookController from "../controllers/BookController";
import authMiddleware from "../middleware/authMiddleware";
import { verify } from "crypto";

const bookRouter = Router();

bookRouter.post("/reviews/add", authMiddleware.verifyAdminOrUser,BookController.addReview);
bookRouter.put("/reviews/update/:reviewId", authMiddleware.verifyAdminOrUser, BookController.updateReview);

export default bookRouter;