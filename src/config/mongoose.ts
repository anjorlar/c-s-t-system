/**
 * Setup mongoose connection using mongoose
 */

import mongoose from "mongoose"
import { settings } from "./settings"
// import {logger } from ""

const uri = settings.environment === "test" ?
    settings.mongodb.testUri : settings.mongodb.uri

export const connectMongoDb = async () => {
    try {
        await mongoose.connect(uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log("Mongo Db connected")
    } catch (error) {
        console.error("connecting to mongo db", error.message)

        process.exit(1)
    }
}