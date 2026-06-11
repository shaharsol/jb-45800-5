import { Router } from "express";
import bodyValidation from "../middlewares/body-validation";
import { freeTextRequest } from "../controllers/free-text/controller";
import { freeTextRequestValidator } from "../controllers/free-text/validator";

const freeTextRouter = Router()

freeTextRouter.post('/', bodyValidation(freeTextRequestValidator), freeTextRequest)

export default freeTextRouter
