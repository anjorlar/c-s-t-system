/**
 * AdminService Object
 * handles business logic relating to AdminModel
 */

import { AdminModel } from "../models/admin"
import { IAdmin } from "../utils/types/custom"

const AdminService = {
    async createAdmin(data: IAdmin) {
        try {
            const admin = new AdminModel(data)
            await admin.save()
            return admin
        } catch (error) {
            throw error;
        }
    },

    async getAdminIdAndRole(id: string) {
        try {
            const admin: { _id: string, role: string }
                | null = await AdminModel.findOne({
                    _id: id,
                    isDeleted: false
                }, '_id role');
            return admin
        } catch (error) {
            throw error;
        }
    },

    async getAdminByEmail(email: string) {
        try {
            const admin = await AdminModel.findOne({
                email
            })
            return admin
        } catch (error) {
            throw error;
        }
    }
}

export default AdminService;