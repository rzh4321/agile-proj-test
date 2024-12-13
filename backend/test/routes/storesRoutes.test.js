import sinon from "sinon";
import { expect } from "chai";
import { describe, it, before, beforeEach } from "mocha";
import supertest from "supertest";
import express from "express";
import Store from "../../src/models/Store.js";
import storesRoutes from "../../src/routes/storesRoutes.js";

const app = express();
app.use(express.json());
app.use("/stores", storesRoutes);

describe("Stores Routes", () => {
  let request;

  before(() => {
    request = supertest(app);
  });

  beforeEach(() => {
    sinon.restore();
  });

  describe("GET /stores", () => {
    it("should return all stores successfully", async () => {
      const mockStores = [
        { _id: "1", name: "Store 1" },
        { _id: "2", name: "Store 2" },
      ];

      sinon.stub(Store, "find").resolves(mockStores);

      const response = await request.get("/stores");

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockStores);
    });

    it("should return 500 if there is an error", async () => {
      sinon.stub(Store, "find").rejects(new Error("Database error"));

      const response = await request.get("/stores");

      expect(response.status).to.equal(500);
      expect(response.body).to.have.property(
        "message",
        "Error fetching stores",
      );
    });
  });
});
