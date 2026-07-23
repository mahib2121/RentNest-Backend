import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
const app: Application = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_URL,
    credentials: true,
  }),
);
export default app;
