/**
 * load environmental variables with dotenv
 * 
 */

import dotenv from "dotenv"
dotenv.config()

interface IEnv {
    appName: string;
    port: number;
    mongodb: IMongodb;
    environment: string;
    jwt: IJwt;
    salt: number;
    redis: any;
    rootAdmin: any;
}

interface IMongodb {
    uri: string;
    testUri: string;
    collections: ICollections;
}

interface IJwt {
    SECRETKEY: string;
    expires: number;
    issuer: string;
    alg: any;
}

interface ICollections {
    user: string;
    admin: string;
    ticket: string;
    category: string;
}

const settings: IEnv = {
    appName: "customer support ticketing systems",
    environment: process.env.NODE_ENV!,
    port: Number(process.env.port),
    jwt: {
        SECRETKEY: process.env.JWT_SECRET_KEY!,
        expires: Number(process.env.JWT_EXPIRY)!,
        issuer: process.env.ISSUER!,
        alg: process.env.JWT_ALG!
    },
    mongodb: {
        uri: process.env.MONGO_DB_URI!,
        testUri: process.env.MONGO_DB_TEST!,
        collections: {
            user: "user",
            admin: "admin",
            ticket: "ticket",
            category: "category",
        },
    },
    salt: Number(process.env.SALT_ROUND)!,
    redis: {
        host: process.env.REDIS_HOST!,
        port: process.env.REDIS_PORT!,
    },
    rootAdmin: {
        name: process.env.ROOT_NAME,
        email: process.env.ROOT_EMAIL,
        password: process.env.ROOT_PASSWORD
    }
}

export { settings };