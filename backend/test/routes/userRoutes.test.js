import sinon from "sinon";
import { expect } from "chai";
import { describe, it, before, beforeEach } from "mocha";
import supertest from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../../src/models/User.js";
import userRoutes from "../../src/routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use("/user", userRoutes);

describe("User Routes", () => {
  let request;

  before(() => {
    request = supertest(app);
  });

  beforeEach(() => {
    // Reset all stubs/mocks before each test
    sinon.restore();
  });

  describe("POST /user/signup", () => {
    it("should create a new user successfully", async () => {
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        password: "hashedpassword",
      };

      // simulate no existing user
      sinon.stub(User, "findOne").resolves(null);

      sinon.stub(bcrypt, "hash").resolves("hashedpassword");

      // Mock User creation
      const saveStub = sinon.stub().resolves(mockUser);
      sinon.stub(User.prototype, "save").callsFake(saveStub);

      sinon.stub(jwt, "sign").returns("fake-token");

      const response = await request.post("/user/signup").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("token", "fake-token");
      expect(response.body).to.have.property("username", "testuser");
    });

    it("should return 400 if username already exists", async () => {
      // simulate existing user
      sinon.stub(User, "findOne").resolves({ username: "testuser" });

      const response = await request.post("/user/signup").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property(
        "message",
        "Username already exists",
      );
    });
  });

  describe("POST /user/login", () => {
    it("should login successfully with correct credentials", async () => {
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        password: "hashedpassword",
      };

      sinon.stub(User, "findOne").resolves(mockUser);
      sinon.stub(bcrypt, "compare").resolves(true);

      // Mock jwt.sign
      sinon.stub(jwt, "sign").returns("fake-token");

      const response = await request.post("/user/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("token", "fake-token");
      expect(response.body).to.have.property("username", "testuser");
    });

    it("should return 400 for invalid credentials", async () => {
      // simulate user not found
      sinon.stub(User, "findOne").resolves(null);

      const response = await request.post("/user/login").send({
        username: "nonexistent",
        password: "wrongpassword",
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("message", "Invalid credentials");
    });
  });

  describe("GET /user/verify-token", () => {
    it("should verify valid token and return user data", async () => {
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        saved_routes: [],
      };

      sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
        callback(null, { userId: mockUser._id, username: mockUser.username });
      });

      sinon.stub(User, "findById").returns({
        select: sinon.stub().returnsThis(),
        populate: sinon.stub().resolves(mockUser),
      });

      const response = await request
        .get("/user/verify-token")
        .set("Authorization", "Bearer fake-token");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("username", "testuser");
    });

    it("should return 401 for invalid token", async () => {
      // dont mock verify token to simulate invalid token
      const response = await request
        .get("/user/verify-token")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).to.equal(401);
    });
  });
});
