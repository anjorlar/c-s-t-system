import { Response } from "express"
import utils from "../utils/utils"
import { logger } from "../utils/logger"
import StatusCodes from "http-status-codes"
import UserService from "../services/UserService"
import { httpResponse } from "../utils/http_response"
import AdminService from "../services/AdminService"
import { CredentialSchema } from "../utils/validation/auth"
import { IRequestAdmin, IRequestUser } from "../utils/types/custom"

/**
 * loginAdmin
 * @description As an admin you should be able login
 * Route: Post: '/api/v1/admin/login'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function loginAdmin(req: IRequestAdmin, res: Response) {
    try {
        const errors = await utils.validateRequest(req.body, CredentialSchema)
        if (errors) {
            return httpResponse.errorResponse(res, errors, StatusCodes.BAD_REQUEST)
        }
        const { email, password } = req.body
        //checks if user exists
        // const email = req.body.email.toLowerCase()

        const admin: any = await AdminService.getAdminByEmail(email.toLowerCase())
        if (!admin) {
            return httpResponse.errorResponse(res, "Invalid login credentials", StatusCodes.UNAUTHORIZED)
        }
        // verify password and generate token
        const passwordMatch = await utils.validatePassword(password, admin.password)
        if (!passwordMatch) {
            return httpResponse.errorResponse(res, "Invalid login credentials", StatusCodes.UNAUTHORIZED)
        }
        const token = admin.generateAuthToken()

        return httpResponse.successResponse(res, {
            user: admin,
            token
        }, "User login successful", StatusCodes.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

/**
 * loginUser
 * @description As a user with correct credentials you should be able login
 * Route: Post: '/api/v1/login'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function loginUser(req: IRequestUser, res: Response) {
    try {
        const errors = await utils.validateRequest(req.body, CredentialSchema)
        if (errors) {
            return httpResponse.errorResponse(res, errors, StatusCodes.BAD_REQUEST)
        }
        //checks if user exists
        const { email, password } = req.body
        const user: any = await UserService.getUserByEmail(email.toLowerCase())
        if (!user) {
            const errMessage = "Invalid login credentials"
            return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
        }

        //verify passwaord and generate token
        const passwordMatch = await utils.validatePassword(password, user.password)
        if (!passwordMatch) {
            const errMessage = "Invalid login credentials"
            return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
        }
        const token = user.generateAuthToken();

        return httpResponse.successResponse(res, { user, token }, 'User login successful', StatusCodes.OK)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}