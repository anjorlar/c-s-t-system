/**
 * UserService Object
 * handles business logic relating to UserModel
 */

import { UserModel } from "../models/user"

const UserService = {
    async createUser(data: any) {
        try {
            const user = new UserModel(data)
            await user.save()
            return user
        } catch (error) {
            throw error
        }
    },

    async checkIfUserExist(id: string) {
        try {
            const user = await UserModel.findOne({
                _id: id, isDeleted: false
            })
            return user
        } catch (error) {
            throw error
        }
    },

    async getUserByEmail(email: string) {
        try {
            const user = await UserModel.findOne({
                email: email, isDeleted: false
            })
            return user
        } catch (error) {
            throw error
        }
    }
}

export default UserService