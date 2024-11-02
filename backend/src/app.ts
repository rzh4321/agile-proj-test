import express from "express";
import { connectToDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import storeRoutes from "./routes/storeRoutes";
import routeRoutes from "./routes/routeRoutes";
import cors from "cors";

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/stores", storeRoutes);
app.use("/api/routes", routeRoutes);

export default app;
