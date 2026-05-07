import { json, Router } from "express";
import { createPost, deletePost, getPost, getProfile } from "../controllers/profile/controller";
import validation from "../middlewares/validation";
import { newPostValidator } from "../controllers/profile/validator";

const profileRouter = Router()

profileRouter.get('/', getProfile)
profileRouter.get('/:postId', getPost)
profileRouter.delete('/:postId', deletePost)
profileRouter.post('/', json(), validation(newPostValidator), createPost)
// profileRouter.patch('/', json(), validation(updatePostValidator), updatePost)

export default profileRouter;