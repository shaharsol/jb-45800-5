import { Router } from "express";
import bodyValidation from "../middlewares/body-validation";
import { generatePic, improve } from "../controllers/drafts/controller";
import { generatePicValidator, improveDraftValidator } from "../controllers/drafts/validator";

const draftsRouter = Router()

draftsRouter.post('/improve', bodyValidation(improveDraftValidator), improve)
draftsRouter.post('/pic', bodyValidation(generatePicValidator), generatePic)

export default draftsRouter

