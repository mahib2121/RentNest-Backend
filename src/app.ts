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
import { rentalRequestRoutes } from "./module/rental-request/rental-request.routes";
import { paymentRouter } from "./module/payment/payment.rou";
import { adminRoutes } from "./module/admin/admin.routes";
import { reviewRoutes } from "./module/review/review.route";

const app: Application = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! RentNest");
});

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
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
app.use("/api/rental-requests", rentalRequestRoutes);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRoutes);
//app.use("/api/reviews",reviewRoutes)
app.use(notFound);
app.use(globalErrorHandler);
export default app;
