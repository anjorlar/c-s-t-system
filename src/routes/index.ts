import { Request, Response, Router } from "express"
import { httpResponse } from "../utils/http_response"
import AdminRouter from "./Admin"
import TicketRouter from "./Ticket"
import UserRouter from "./User"

//init router and path
const router = Router();

router.use("/health", (req: Request, res: Response) => {
    const message = "CSTS Server is up and running";
    return httpResponse.successResponse(res, [], message)
});


//Add sub routes

router.use(UserRouter)
router.use(TicketRouter)
router.use("/admin", AdminRouter)



export default router