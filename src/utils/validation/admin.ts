import Joi from "joi"

export const CreateAdminSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required().min(6),
    role: Joi.string(),
});