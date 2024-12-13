import express from "express";
import Route from "../models/Route.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // eslint-disable-next-line no-undef
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};

// getting a specific route
router.get("/:routeId", async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findById(routeId).populate("stores");

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: "Error fetching route", error });
  }
});

// Create new route
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, stores } = req.body;

    if (stores.length === 0) {
      res.status(500).json({
        message: `Error creating route: A route must have at least one store.`,
      });
    }

    const newRoute = new Route({
      name,
      description,
      stores,
      created_by: req.username,
    });

    await newRoute.save();

    // add route to users saved_routes
    await User.findByIdAndUpdate(req.userId, {
      $push: { saved_routes: newRoute._id },
    });

    const populatedRoute = await Route.findById(newRoute._id).populate(
      "stores",
    );
    res.status(201).json(populatedRoute);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error creating route: ${error}` });
  }
});

// Update route
router.put("/:routeId", verifyToken, async (req, res) => {
  try {
    const { name, description, stores } = req.body;
    const { routeId } = req.params;

    if (stores.length === 0) {
      res.status(500).json({
        message: `Error creating route: A route must have at least one store.`,
      });
    }

    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      {
        name,
        description,
        stores,
      },
      { new: true },
    ).populate("stores");

    if (!updatedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(updatedRoute);
  } catch (error) {
    res.status(500).json({ message: "Error updating route", error });
  }
});

// Delete route
router.delete("/:routeId", verifyToken, async (req, res) => {
  try {
    const { routeId } = req.params;

    // Remove route from user's saved_routes
    await User.findByIdAndUpdate(req.userId, {
      $pull: { saved_routes: routeId },
    });

    // Delete the route
    await Route.findByIdAndDelete(routeId);

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting route", error });
  }
});

export default router;
