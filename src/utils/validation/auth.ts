import Joi from "joi"

export const CredentialSchema = Joi.object({
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required().min(6)
});