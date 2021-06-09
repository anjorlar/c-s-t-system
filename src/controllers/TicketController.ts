import { Response } from "express"
import { v4 as uuidv4 } from 'uuid'
const { parse } = require("json2csv")
import { IRequestUser, ITicket, IRequestAdmin } from "../utils/types/custom"
import TicketService from "../services/TicketService"
import StatusCode from "http-status-codes"
import { logger } from "../utils/logger"
import { httpResponse } from "../utils/http_response"
import { CreateTicketSchema, UpdateTicketCommentSchema } from "../utils/validation/ticket"
import utils from "../utils/utils"
import redis from "../config/redis"
import { error } from "winston"


/**
 * newTicket
 * @description A user should be able to create support ticket
 * @Route Route '/api/v1/ticket'
 * @param req request object
 * @param res response object
 * @returns {void|Object} object
 */
export async function newTicket(req: IRequestUser, res: Response) {
    try {
        const error = await utils.validateRequest(req.body, CreateTicketSchema);
        if (error) {
            return httpResponse.errorResponse(res, error, StatusCode.BAD_REQUEST)
        }

        const userId = req.user?._id;
        const { subject, content } = req.body;

        const ticketObject: ITicket = {
            subject, content,
            ticketId: uuidv4(),
            userId: userId
        }
        //save ticket
        const ticket = await TicketService.createTicket(ticketObject)
        redis.del(`${userId}:all`)
        redis.del(`${userId}:pending`)
        redis.del(`tickets:all`)
        return httpResponse.successResponse(res, { ticket }, "ticket created successfully", StatusCode.CREATED)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
};

/**
 * getTicket
 * @description A user gets the details of a ticket with a given id
 * route: get: '/api/v1/ticket/:id'
 * @param {object} req request object
 * @param {object} res response object
 * @returns {void|object} object
 */
export async function getTicket(req: IRequestUser, res: Response) {
    try {
        const ticketId = req.params.id
        const userId = req.user?._id

        const ticket: any = await TicketService.findTicket(userId, ticketId)
        if (!ticket) {
            return httpResponse.errorResponse(res, "ticket not found", StatusCode.NOT_FOUND)
        }

        redis.setex(`${ticket.ticketId}`, 3600, JSON.stringify(ticket))
        return httpResponse.successResponse(res, { ticket }, "ticket found", StatusCode.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
};


export async function findTicket(req: IRequestUser, res: Response) {
    try {
        const ticketId = req.params.id
        const userId = req.user?._id

        const ticket: any = await TicketService.findTicketAdmin(ticketId)
        if (!ticket) {
            return httpResponse.errorResponse(res, "ticket not found", StatusCode.NOT_FOUND)
        }
        redis.setex(`${ticket.ticketId}`, 3600, JSON.stringify(ticket))
        return httpResponse.successResponse(res, { ticket }, "ticket found", StatusCode.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
};

export async function getUserTickets(req: any, res: Response) {
    try {
        const userId = req.user?._id
        const defaultStartDate = new Date("1970-01-01").toISOString()
        const defaultEndDate = new Date().toISOString()
        const { limit, page } = req.query
        const query = {
            startDate: req.query.startDate ? new Date(req.query.startDate).toISOString() : defaultStartDate,
            endDate: req.query.endDate ? new Date(req.query.endDate).toISOString() : defaultEndDate,
            status: req.query.status ? [req.query.status] : ["pending", "open", "closed"]
        }

        const tickets: any = await TicketService.getUserTickets(userId, query)

        if (!tickets.length) {
            return httpResponse.errorResponse(res, 'no tickets found', StatusCode.NOT_FOUND)
        }
        const status = req.query.status ? req.query.status : "all"
        redis.setex(`${userId}:${status}`, 3600, JSON.stringify(tickets))
        const result = await utils.paginator(tickets, limit, req.query.page)
        return httpResponse.successResponse(res, result, "ticket found", StatusCode.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
};


export async function userCommentOnTicket(req: any, res: Response) {
    try {
        const userId = req.user?._id
        const ticketId = req.params.id
        const { comment } = req.body

        const errors = await utils.validateRequest(req.body, UpdateTicketCommentSchema)
        if (errors) {
            return httpResponse.errorResponse(res, errors, StatusCode.NOT_FOUND)
        }
        const ticket = await TicketService.findTicketById(ticketId)
        if (!ticket) {
            return httpResponse.errorResponse(res, "ticket does not exist", StatusCode.NOT_FOUND)
        }
        if (!ticket.isOpenForComment) {
            return httpResponse.errorResponse(res, "comment not allowed", StatusCode.FORBIDDEN)
        }

        const comments = [...ticket.meta.comments]
        comments.push({
            comment,
            commenter: userId,
            onModel: 'user'
        });
        const meta = ticket.meta
        meta.comments = comments

        const updateTicket = await TicketService.updateTickets(ticket._id, { meta })
        redis.del(`${ticketId}`)
        redis.del(`${userId}:all`)
        redis.del(`${userId}:open`)
        redis.del(`${userId}:closed`)
        redis.del(`tickets:all`)
        return httpResponse.successResponse(res,
            { ticket: updateTicket },
            "Ticket updated successfully", StatusCode.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}


export async function updateTicket(req: any, res: Response) {
    try {
        const userId = req.user?._id
        const ticketId = req.params.id
        const { comment, status } = req.body

        const errors = await utils.validateRequest(req.body, UpdateTicketCommentSchema)
        if (errors) {
            return httpResponse.errorResponse(res, errors, StatusCode.NOT_FOUND)
        }

        const ticket = await TicketService.findTicketById(ticketId)
        if (!ticket) {
            return httpResponse.errorResponse(res, "ticket does not exist", StatusCode.NOT_FOUND)
        }

        const updateObject: any = {}

        if (comment) {
            const comments = [...ticket.meta.comments];
            comments.push({
                comment,
                commenter: userId,
                onModel: 'user'
            });
            const meta = ticket.meta
            meta.comments = comments
            updateObject.meta = meta
            if (!ticket.isOpenForComment) {
                updateObject.isOpenForComment = true
            }
        }

        if (status) {
            updateObject.status = status
        }

        if (status == "closed") {
            updateObject.treatedById = userId
            updateObject.treatedById = new Date
        }

        const updatedTicket = await TicketService.updateTickets(ticket._id, updateObject)
        redis.del(`${ticketId}`)
        redis.del(`${ticket.userId}:all`)
        redis.del(`${ticket.userId}:open`)
        redis.del(`${ticket.userId}:closed`)
        redis.del(`tickets:all`)

        return httpResponse.successResponse(res,
            { ticket: updateTicket },
            "Ticket updated successfully", StatusCode.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}


export async function getAllTickets(req: any, res: Response) {
    try {
        const defaultStartDate = new Date("1970-01-01").toISOString()
        const defaultEndDate = new Date().toISOString()
        const { limit, page } = req.query
        const query = {
            startDate: req.query.startDate ? new Date(req.query.startDate).toISOString() : defaultStartDate,
            endDate: req.query.endDate ? new Date(req.query.endDate).toISOString() : defaultEndDate,
            status: req.query.status ? [req.query.status] : ["pending", "open", "closed"]
        }

        const tickets: any = await TicketService.getAllUserTickets(query)

        if (!tickets.length) {
            return httpResponse.errorResponse(res, 'no tickets found', StatusCode.NOT_FOUND)
        }
        const status = req.query.status ? req.query.status : "all"
        redis.setex(`ticket:${status}`, 3600, JSON.stringify(tickets))
        const result = await utils.paginator(tickets, limit, page)
        return httpResponse.successResponse(res, result, "ticket found", StatusCode.OK)

    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}


export async function getTicketsReport(req: any, res: Response) {
    try {
        const tickets: any = await TicketService.getClosedUserTickets()
        if (!tickets.length) {
            return httpResponse.errorResponse(res, "no reports", StatusCode.NOT_FOUND)
        }
        let finalArr = []

        for (let ticket of tickets) {
            const body = {
                id: ticket.ticketId,
                customer: ticket.userId.name,
                email: ticket.userId.email,
                subject: ticket.subject,
                content: ticket.content,
                requestDate: ticket.createdAt,
                agent: ticket.treatedById.name,
                closedDate: ticket.treatedDate,
            }
            finalArr.push(body)
        }

        const result = finalArr
        const data = JSON.parse(JSON.stringify(result))
        const csvFields = [
            "id", "customer", "email", "subject", "content", "requestDate", "agent", "closedDate"
        ]
        const opts = { csvFields }
        const csvData = parse(data, opts)

        //send as csv
        return httpResponse.downloadResponse(res, csvData, "report.csv")
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}