import Joi from "joi"

export const CreateTicketSchema = Joi.object({
    subject: Joi.string().required(),
    content: Joi.string().required(),
})

export const UpdateTicketCommentSchema = Joi.object({
    comment: Joi.string().min(1),
    status: Joi.string()
})