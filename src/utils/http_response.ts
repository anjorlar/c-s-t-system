/**
 * http_responder object to manage response to all incoming request
 */

import { Response } from "express"
import Status from "http-status-codes"

const httpResponse = {
    async errorResponse(res: Response, message: string = '', statusCodes: number = Status.INTERNAL_SERVER_ERROR) {
        return res.status(statusCodes).send({
            error: true,
            code: statusCodes,
            message
        });
    },
    async successResponse(res: Response, data: any = {}, message: string = '', statusCodes: number = Status.OK) {
        return res.status(statusCodes).send({
            error: false,
            code: statusCodes,
            message,
            data
        });
    },

    async downloadResponse(res: Response, data: any, filename: string = 'data.csv', statusCodes: number = Status.OK) {
        res.setHeader("Content-disposition", `attachment; filename=${filename}`);
        res.set("Content-Type", "type/csv")
        return res.status(statusCodes).end(data)
    }
}

export { httpResponse }