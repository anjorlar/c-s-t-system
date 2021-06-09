import { Response, NextFunction } from "express"
import StatusCodes from "http-status-codes"
import { httpResponse } from "../utils/http_response"
import utils from "../utils/utils"
import AdminService from "../services/AdminService"
import UserService from "../services/UserService"

/**
 * authToken
 * @desc A middleware to authenticate users token
 * @param {Object} req request any
 * @param {Object} res response any
 * @param {Function} next nextfunction middleware
 * @returns {void|Object} object
 */
export const authToken = (req: any, res: Response, next: NextFunction) => {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
        const errMessage = "Access denied. No token provided."
        return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
    }
    const token = bearerToken.split(' ')[0];
    //verify token
    try {
        const decoded = utils.verifyToken(token)

        req.id = decoded.id;

        next()
    } catch (err) {
        console.log('>>>>>>> err', err)
        // const errMessage = "Invalid token. Please login"
        return httpResponse.errorResponse(res, err.message, StatusCodes.UNAUTHORIZED)
    }
};

/**
 * authAdmin
 * @desc A middleware to authenticate admin user
 * @param {Object} req request any
 * @param {Object} res response any
 * @param {Function} next nextfunction middleware
 * @returns {void|Object} object
 */
export const authAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const admin = await AdminService.getAdminIdAndRole(req.id)
        if (!admin) {
            const errMessage = "Invalid token. Please login"
            return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
        }

        req.user = admin;
        // console.log(">>>>>  req.user", req.user)
        next()
    } catch (err) {
        console.log('>>>>>>> err', err)
        const errMessage = "Invalid token. Please login"
        return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
    }
};

/**
 * adminAccess
 * @desc A middleware to verify if admin has the required role
 * @param req request any
 * @param res response any
 * @param next nextfunction middleware
 * @returns {void|Object} object
 */
export const adminAccess = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== "admin") {
            const errMessage = "Unauthorized action"
            return httpResponse.errorResponse(res, errMessage, StatusCodes.FORBIDDEN)
        }
        next()
    } catch (err) {
        console.log('>>>>>>> err', err)
        const errMessage = "Access denied. Unauthorized action"
        return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
    }
};


/**
 * authUser
 * @desc A middleware to authenticate admin user
 * @param {Object} req request any
 * @param {Object} res response any
 * @param {Function} next nextfunction middleware
 * @returns {void|Object} object
 */
export const authUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.checkIfUserExist(req.id)
        if (!user) {
            const errMessage = "Invalid token. Please login"
            return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
        }

        req.user = user;
        next()
    } catch (err) {
        console.log('>>>>>>> err', err)
        const errMessage = "Invalid token. Please login"
        return httpResponse.errorResponse(res, errMessage, StatusCodes.UNAUTHORIZED)
    }
};