import { Router } from "express";
import  UserController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";
import { verify } from "crypto";

const userRouter = Router();

userRouter.post("/reviews/add", authMiddleware.verifyAdminOrUser, UserController.addReview);
userRouter.put("/reviews/update/:reviewId", authMiddleware.verifyAdminOrUser, UserController.updateReview);

export default userRouter;