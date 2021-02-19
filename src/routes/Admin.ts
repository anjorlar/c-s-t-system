import { Router } from "express"
import * as AdminController from "../controllers/AdminController";
//
//
import { authToken, authAdmin, adminAccess } from "../middlewares/Auth"

const router = Router();

router.post("/", authToken, authAdmin, adminAccess, AdminController.newAdmin);

export default router