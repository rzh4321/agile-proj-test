import { Response, Router } from "express";
import Route from "../models/Route";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = Router();

// Middleware to verify token
const verifyToken = (req: any, res: Response, next: Function): any => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.userId = decoded.userId;
      next();
    },
  );
};

// getting a specific route
router.get(
  "/:routeId",
  verifyToken,
  async (req: any, res: Response): Promise<any> => {
    try {
      const { routeId } = req.params;

      const route = await Route.findById(routeId)
        .populate("stores")
        .populate("created_by", "-password"); // Exclude password field from created_by user

      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }

      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Error fetching route", error });
    }
  },
);

// Create new route
router.post("/", verifyToken, async (req: any, res: Response) => {
  try {
    const { name, description, stores } = req.body;

    const newRoute = new Route({
      name,
      description,
      stores,
      created_by: req.userId,
    });

    await newRoute.save();

    // add route to users saved_routes
    await User.findByIdAndUpdate(req.userId, {
      $push: { saved_routes: newRoute._id },
    });

    const populatedRoute = await Route.findById(newRoute._id)
      .populate("stores")
      .populate("created_by", "-password");
    res.status(201).json(populatedRoute);
  } catch (error) {
    res.status(500).json({ message: "Error creating route", error });
  }
});

// Update route
router.put(
  "/:routeId",
  verifyToken,
  async (req: any, res: Response): Promise<any> => {
    try {
      const { name, description, stores } = req.body;
      const { routeId } = req.params;

      const updatedRoute = await Route.findByIdAndUpdate(
        routeId,
        {
          name,
          description,
          stores,
        },
        { new: true },
      )
        .populate("stores")
        .populate("created_by", "-password");
      if (!updatedRoute) {
        return res.status(404).json({ message: "Route not found" });
      }

      res.json(updatedRoute);
    } catch (error) {
      res.status(500).json({ message: "Error updating route", error });
    }
  },
);

// Delete route
router.delete("/:routeId", verifyToken, async (req: any, res: Response) => {
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
