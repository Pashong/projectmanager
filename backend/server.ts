import express from "express";
import cors from "cors";
import {pool} from "./database/database";
import registerRoute from "./routes/user/register";
import loginRoute from "./routes/user/login";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/login", loginRoute);
app.use("/register", registerRoute);

app.listen(3030, () =>{
    console.log("Backend is running on port 3030");
});