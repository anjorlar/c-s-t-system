import { app } from "./app"
import { settings } from "./config/settings";
import { logger } from "./utils/logger"

//Starts Server
app.listen(settings.port, () => {
    console.log(`App is listen on Port ${settings.port}`)
    logger.info(`App is listen on Port ${settings.port}`)
})
