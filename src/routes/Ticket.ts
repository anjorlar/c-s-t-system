import { Router } from "express"
import * as TicketController from "../controllers/TicketController";
import * as AuthController from "../controllers/AuthController"
import { authToken, authUser, authAdmin } from "../middlewares/Auth"
import { cachedTicket, cachedUserTickets, cachedTickets } from "../middlewares/Cache"

//init router and path
const router = Router()

//add sub routes

router.post("/ticket", authToken, authUser, TicketController.newTicket)
router.get("/tickets/history", authToken, authUser, cachedUserTickets, TicketController.getUserTickets)
router.get("/tickets", authToken, authAdmin, cachedTickets, TicketController.getAllTickets)
router.get("/tickets/report", authToken, authAdmin, TicketController.getTicketsReport)
router.get("/tickets/:id", authToken, authUser, cachedTicket, TicketController.getTicket)
router.put("/tickets/:id", authToken, authUser, TicketController.userCommentOnTicket)



//export the base router
export default router;