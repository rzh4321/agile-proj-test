import sinon from "sinon";
import { expect } from "chai";
import { describe, it, before, beforeEach } from "mocha";
import supertest from "supertest";
import express from "express";
import Route from "../../src/models/Route.js";
import User from "../../src/models/User.js";
import jwt from "jsonwebtoken";
import savedRoutes from "../../src/routes/savedRoutes.js";

const app = express();
app.use(express.json());
app.use("/routes", savedRoutes);

describe("Saved Routes", () => {
  let request;
  const validToken = "valid-token";
  const userId = "507f1f77bcf86cd799439011";

  before(() => {
    request = supertest(app);
    // Mock environment variable
    // process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => {
    sinon.restore();
  });

  describe("GET /routes/:routeId", () => {
    it("should return a specific route", async () => {
      const mockRoute = {
        _id: "123",
        name: "Test Route",
        stores: ["store1", "store2"],
      };

      const populateStub = sinon.stub().resolves(mockRoute);
      sinon.stub(Route, "findById").returns({ populate: populateStub });

      const response = await request.get("/routes/123");

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockRoute);
    });

    it("should return 404 if route not found", async () => {
      // simulate nonexistent route
      const populateStub = sinon.stub().resolves(null);
      sinon.stub(Route, "findById").returns({ populate: populateStub });

      const response = await request.get("/routes/nonexistent");

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("message", "Route not found");
    });
  });

  describe("POST /routes", () => {
    beforeEach(() => {
      // Mock jwt.verify for all tests requiring authentication
      sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
        callback(null, { userId, username: "testuser" });
      });
    });

    it("should create a new route successfully", async () => {
      const mockRoute = {
        _id: "123",
        name: "New Route",
        description: "Test Description",
        stores: ["store1", "store2"],
      };

      const saveStub = sinon.stub().resolves(mockRoute);
      sinon.stub(Route.prototype, "save").callsFake(saveStub);
      sinon.stub(User, "findByIdAndUpdate").resolves({});

      const populateStub = sinon.stub().resolves(mockRoute);
      sinon.stub(Route, "findById").returns({ populate: populateStub });

      const response = await request
        .post("/routes")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          name: "New Route",
          description: "Test Description",
          stores: ["store1", "store2"],
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(mockRoute);
    });

    it("should return 500 if no stores provided", async () => {
      const response = await request
        .post("/routes")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          name: "New Route",
          description: "Test Description",
          stores: [],
        });

      expect(response.status).to.equal(500);
      expect(response.body.message).to.include(
        "A route must have at least one store",
      );
    });
  });

  describe("PUT /routes/:routeId", () => {
    beforeEach(() => {
      // Add JWT verification mock
      sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
        callback(null, { userId, username: "testuser" });
      });
    });

    it("should update a route successfully", async () => {
      const mockUpdatedRoute = {
        _id: "123",
        name: "Updated Route",
        stores: ["store1", "store2"],
      };

      const populateStub = sinon.stub().resolves(mockUpdatedRoute);
      sinon
        .stub(Route, "findByIdAndUpdate")
        .returns({ populate: populateStub });

      const response = await request
        .put("/routes/123")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          name: "Updated Route",
          description: "Updated Description",
          stores: ["store1", "store2"],
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockUpdatedRoute);
    });

    it("should return an error if no stores provided", async () => {
      const response = await request
        .put("/routes/123")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          name: "Updated Route",
          description: "Updated Description",
          stores: [],
        });

      expect(response.status).to.equal(500);
    });
  });

  describe("DELETE /routes/:routeId", () => {
    beforeEach(() => {
      // Add JWT verification mock
      sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
        callback(null, { userId, username: "testuser" });
      });
    });

    it("should delete a route successfully", async () => {
      sinon.stub(User, "findByIdAndUpdate").resolves({});
      sinon.stub(Route, "findByIdAndDelete").resolves({});

      const response = await request
        .delete("/routes/123")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property(
        "message",
        "Route deleted successfully",
      );
    });

    it("should return 500 if error occurs", async () => {
      sinon
        .stub(User, "findByIdAndUpdate")
        .rejects(new Error("Database error"));

      const response = await request
        .delete("/routes/123")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).to.equal(500);
      expect(response.body).to.have.property("message", "Error deleting route");
    });
  });
});
