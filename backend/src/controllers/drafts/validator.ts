import Joi from "joi";

export const improveDraftValidator = Joi.object({
    body: Joi.string().required()
})

export const generatePicValidator = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required()
})

