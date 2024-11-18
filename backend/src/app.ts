import express from "express";
import { connectToDatabase } from "./config/database";
import userRoutes from "./routes/userRoutes";
import storeRoutes from "./routes/storeRoutes";
import routeRoutes from "./routes/routeRoutes";
import cors from "cors";

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/stores", storeRoutes);
app.use("/routes", routeRoutes);

export default app;
