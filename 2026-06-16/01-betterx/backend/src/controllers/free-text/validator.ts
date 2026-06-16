import Joi from "joi";

export const freeTextRequestValidator = Joi.object({
    prompt: Joi.string().required(),
    chatId: Joi.string().uuid().required(),
})
