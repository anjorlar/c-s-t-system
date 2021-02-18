import { Request, Response, NextFunction } from "express"
import StatusCodes from "http-status-codes"
import { httpResponse } from "../utils/http_response"
import utils from "../utils/utils"
import redis from "../config/redis"
import { parse } from "dotenv/types"


/**
 * cachedUserTickets
 * @description A middleware to fetch cached user ticket
 * @param {Object} req  request any
 * @param {Object} res  response object
 * @param {Function} next next function middleware
 * @returns {void|Object} object
 */
export const cachedUserTickets = (req: any, res: Response, next: NextFunction) => {
    try {
        const user = req.user.id;
        const status = (req.query.status) ? req.query.status : "all";
        redis.get(`${user}:${status}`, async (err, tickets) => {
            if (err) throw err;
            if (tickets) {
                const { limit, page } = req.query;
                const dataArray = JSON.parse(tickets);
                const result = await utils.paginator(dataArray, parseInt(limit), parseInt(page));
                return httpResponse.successResponse(res, result, "tickets found", StatusCodes.OK)
            }
        })
        next()
    } catch (err) {
        const errMessage = "Server error";
        return httpResponse.errorResponse(res, errMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    };
};

/**
 * cachedTicket
 * @description A middleware to authenticate admin users
 * @param {Object} req  request any
 * @param {Object} res  response object
 * @param {Function} next next function middleware
 * @returns {void|Object} object
 */
export const cachedTicket = async (req: any, res: Response, next: NextFunction) => {
    try {
        const ticketId = req.params.id
        redis.get(`${ticketId}`, (err, data) => {
            if (err) throw err;
            if (data) {
                const ticket = JSON.parse(data)
                return httpResponse.successResponse(res, { ticket }, `ticket found`, StatusCodes.OK);
            }
            next()
        })

    } catch (err) {
        const errMessage = "Server error";
        return httpResponse.errorResponse(res, errMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const cachedTickets = async (req: any, res: Response, next: NextFunction) => {
    try {
        const status = (req.query.status) ? req.query.status : "all";
        redis.get(`tickets:${status}`, async (err, tickets) => {
            if (err) throw err;
            if (tickets) {
                const { limit, page } = req.query;
                const dataArray = JSON.parse(tickets);
                const result = await utils.paginator(dataArray, parseInt(limit), parseInt(page))
                return httpResponse.successResponse(res, result, 'tickets found', StatusCodes.OK)
            }
            next()
        })
    } catch (err) {
        const errMessage = "Server error";
        return httpResponse.errorResponse(res, errMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}