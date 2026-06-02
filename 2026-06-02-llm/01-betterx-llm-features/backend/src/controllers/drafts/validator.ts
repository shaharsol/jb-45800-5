import Joi from "joi";

export const improveDraftValidator = Joi.object({
    body: Joi.string().required()
})

