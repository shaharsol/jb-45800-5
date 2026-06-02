import { Router } from "express";
import bodyValidation from "../middlewares/body-validation";
import { improve } from "../controllers/drafts/controller";
import { improveDraftValidator } from "../controllers/drafts/validator";

const draftsRouter = Router()

draftsRouter.post('/improve', bodyValidation(improveDraftValidator), improve)

export default draftsRouter

