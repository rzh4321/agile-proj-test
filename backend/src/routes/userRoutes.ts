import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// Middleware to verify token
const verifyToken = (req: any, res: Response, next: Function): any => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No JWT provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired JWT" });
      }
      req.userId = decoded.userId;
      req.username = decoded.username;
      next();
    },
  );
};

// verify token route
router.get("/verify-token", async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // extract token from Bearer token

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }

        // token is valid, fetch user data. Decoded is the _id and username. Exclude the password
        // populate the stores in each saved route
        const user = await User.findById((decoded as any).userId)
          .select("-password")
          .populate({
            path: "saved_routes",
            populate: {
              path: "stores",
            },
          });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Error verifying token", error });
  }
});

// get all saved routes for a specific user
router.get(
  "/saved-routes",
  verifyToken,
  async (req: any, res: Response): Promise<any> => {
    try {
      console.log("your user id is ", req.userId);
      const userId = req.userId;
      // verify that the requesting user is accessing their own routes
      if (userId !== req.userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to access these routes" });
      }

      const user = await User.findById(userId).populate({
        path: "saved_routes",
        populate: {
          path: "stores",
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(user.saved_routes);

      res.json(user.saved_routes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching saved routes", error });
    }
  },
);

// Signup route
router.post("/signup", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Create and sign JWT
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    // only need to return username. Client will call verifyToken to get full user object
    res.status(201).json({ token, username });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// login route
router.post("/login", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    // only need to return username. Client will call verifyToken to get full user object
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
