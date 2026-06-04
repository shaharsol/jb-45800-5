import { Router } from "express";
import { deletePost, getPost, getProfile } from "../controllers/profile/controller";

const profileRouter = Router()

profileRouter.get('/', getProfile)
profileRouter.get('/:postId', getPost)
profileRouter.delete('/:postId', deletePost)

export default profileRouter;