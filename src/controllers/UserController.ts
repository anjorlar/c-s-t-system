import { Request, Response } from "express"
import utils from "../utils/utils"
import { logger } from "../utils/logger"
import StatusCodes from "http-status-codes"
import UserService from "../services/UserService"
import { httpResponse } from "../utils/http_response"
import { IUser } from "../utils/types/custom"
import { CreateUserSchema } from "../utils/validation/user"

/**
 * newUser
 * @route Post: '/api/v1/register' 
 * @description
 * @param {Object} req req request any
 * @param {Object} res rer response any
 * @returns {void|Object}
 */
export async function newUser(req: Request, res: Response) {
    try {
        //validate request object
        const errors = await utils.validateRequest(req.body, CreateUserSchema);
        if (errors) {
            return httpResponse.errorResponse(res, errors, StatusCodes.BAD_REQUEST)
        }
        const { name, email, password } = req.body

        //check if user exist
        const existingUser = await UserService.getUserByEmail(email.toLowerCase());
        if (existingUser) {
            return httpResponse.errorResponse(res, "User already exist", StatusCodes.BAD_REQUEST)
        }
        const userObject: IUser = {
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            password: password
        }

        //create user
        const user = await UserService.createUser(userObject);
        // create token
        const token = user.generateAuthToken()

        //return newly created user
        return httpResponse.successResponse(res,
            { user, token },
            'User created successfully',
            StatusCodes.CREATED)
    } catch (error) {
        logger.error(JSON.stringify(error))
        return httpResponse.errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}