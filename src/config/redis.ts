

import redis from "redis"
import { settings } from "./settings"
import { logger } from "../utils/logger"

const redisClient = redis.createClient(
    settings.redis.port, settings.redis.host
)

redisClient.on('connect', function () {
    console.log('Connection to redis has been established successfully.')
})

redisClient.on('error', function () {
    console.error("Unable to connect to redis")
    process.exit(1)
})

export default redisClient
