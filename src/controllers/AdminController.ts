import { Response } from "express";
import statusCodes from "http-status-codes"
import AdminService from "../services/AdminService"
import utils from "../utils/utils"
import { logger } from "../utils/logger"
import { httpResponse } from "../utils/http_response"
import { CreateAdminSchema } from "../utils/validation/admin"
import { IRequestAdmin, IAdmin } from "../utils/types/custom"

/**
 * @description As an admin with the role admin you should be able create other admin user with unique email
 * @route POST: '/api/v1/admin/invite'
 * @param {Object} req req request any
 * @param {Object} res res response any
 * @returns {void|Object} object
 */
export async function newAdmin(req: IRequestAdmin, res: Response) {
    try {
        //validate request payload
        const errors = await utils.validateRequest(req.body, CreateAdminSchema);
        if (errors) {
            return httpResponse.errorResponse(res, errors, statusCodes.BAD_REQUEST)
        }

        const { name, email, role, password } = req.body
        const checkEmail = await AdminService.getAdminByEmail(email.toLowerCase());
        if (checkEmail) {
            const errMessage = "Email already exist";
            return httpResponse.errorResponse(res, errMessage, statusCodes.BAD_REQUEST)
        }
        const adminObject: IAdmin = {
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            role: role.toLowerCase(),
            password: password
        }
        //save admin
        const user = await AdminService.createAdmin(adminObject)
        return httpResponse.successResponse(res, { user }, "user created successfully", statusCodes.CREATED)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, statusCodes.INTERNAL_SERVER_ERROR);
    }
}
