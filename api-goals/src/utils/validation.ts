import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

export const desireSchema = Joi.object({
    name_desire: Joi.string().required(),
    description_desire: Joi.string().optional(),
    tariff: Joi.number().positive().required(),
    image: Joi.optional()
})

export const installmentSchema = Joi.object({
    installment: Joi.number().positive().required()
})

