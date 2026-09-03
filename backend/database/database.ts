import { config } from "../config";
import { Pool } from 'pg';

export const pool = new Pool(config);

pool.connect()
.then(pool => {
    console.log("DB CONNECTED");
    return pool;
})
.catch(err => {
    console.log("DB connection failed", err);
    process.exit(1);
});

