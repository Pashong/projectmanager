import dotenv from "dotenv";

dotenv.config();

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}


export const config = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
}