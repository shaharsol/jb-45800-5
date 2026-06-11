import Joi from "joi";

export const freeTextRequestValidator = Joi.object({
    prompt: Joi.string().required(),
})
