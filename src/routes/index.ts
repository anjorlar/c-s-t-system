import { Request, Response, Router } from "express"
import { httpResponse } from "../utils/http_response"
import AdminRouter from "./Admin"
// import {}




//init router and path
const router = Router();

router.use("/health", (req: Request, res: Response) => {
    const message = "CSTS Server is up and running";
    return httpResponse.successResponse(res, [], message)
});

//Add sub routes

router.post("/admin", AdminRouter)


export default router