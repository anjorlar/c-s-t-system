import { Router } from "express"
import * as AdminController from "../controllers/AdminController";
import * as AuthController from "../controllers/AuthController"
import * as TicketController from "../controllers/TicketController"
import { authToken, authAdmin, adminAccess } from "../middlewares/Auth"

const router = Router();

router.post("/register", authToken, authAdmin, adminAccess, AdminController.newAdmin);
router.post("/login", AuthController.loginAdmin)
router.get("/tickets/:id", authToken, authAdmin, TicketController.findTicket)
router.put("/tickets/:id", authToken, authAdmin, TicketController.updateTicket)

export default router