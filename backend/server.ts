import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import registerRoute from "./routes/user/registerRoute";
import loginRoute from "./routes/user/loginRoute";
import projectsRoute from "./routes/projects/projectsRoute";
import tasksRoute from "./routes/tasks/tasksRoute";
import authRoute from "./routes/authenticate/authRoute";
import logoutRoute from "./routes/user/logoutRoute";
import userRoute from "./routes/user/usersRoute";
import taskItemRoute from "./routes/tasks/taskItemRoute";


const app = express();

app.use(
  cors({
    origin: ['http://localhost:4200', `http://${process.env.network}:4200`, 'https://proman.portfolio-hg.de', 'https://portfolio-hg.de'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/projects", projectsRoute);
app.use("/tasks", tasksRoute);
app.use("/auth", authRoute)
app.use("/logout", logoutRoute);
app.use("/users", userRoute);
app.use("/task-items", taskItemRoute);


app.listen(3030, '0.0.0.0',() =>{
    console.log("Backend is running on port 3030");
});