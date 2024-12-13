import express from "express";
import { connectToDatabase } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import storesRoutes from "./routes/storesRoutes.js";
import savedRoutes from "./routes/savedRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

connectToDatabase();

app.use(
  cors({
    origin: [
      "http://174.138.47.181:4173", // production frontend
      "http://localhost:5173", // Local development frontend
      "http://localhost:5174", // Local development frontend
      "http://localhost:4173", // Local preview frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

app.use(express.json());

// routes
app.use("/user", userRoutes);
app.use("/stores", storesRoutes);
app.use("/routes", savedRoutes);

export default app;
