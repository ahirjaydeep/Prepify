import express from "express";
import cors from "cors";
import { router } from "./routes/interview.route.js";
import { jobRouter } from "./routes/job.route.js";
import { userRouter } from "./routes/user.route.js";

const server = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://prepifyinterviewer.netlify.app",
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("uploads"));
server.use("/api/v1/interview", router);
server.use("/api/v1/job", jobRouter);
server.use("/api/v1/user", userRouter);

export default server;
