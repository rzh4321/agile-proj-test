import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores", error });
  }
});

export default router;
