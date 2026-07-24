import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./module/user/user.route";
import { authRoutes } from "./module/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { categoryRoutes } from "./module/category/category.routes";
import { propertyRoutes } from "./module/Properties/properties.route";
const app: Application = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! RentNest");
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

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use(notFound);
app.use(globalErrorHandler);
export default app;
