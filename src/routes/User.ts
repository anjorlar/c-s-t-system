import { Router } from "express"
import * as UserController from "../controllers/UserController";
import * as AuthController from "../controllers/AuthController"
import { authToken, authAdmin, adminAccess } from "../middlewares/Auth"

//init router and path
const router = Router()


router.post("/login", AuthController.loginUser)
router.post("/register", UserController.newUser)

//export the base router
export default router;