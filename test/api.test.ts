import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  test,
  expect,
} from "vitest";
import { build } from "../src/app";
import { FastifyInstance } from "fastify";
import prisma from "../src/database";
import {
  CompletedApplication,
  InProgressApplication,
} from "../src/schemas/application";
import { stubValidCompleteApplication } from "./mockData/applications.mock";
import { Vehicles } from "../src/schemas/vehicle";

let server: FastifyInstance;
let baseURL: string;

beforeAll(async () => {
  // Create the Fastify server instance
  server = await build();

  // Start the server on a random available port
  await server.listen({ port: 0 });

  // Get the address of the running server
  const addressInfo = server.server.address();
  if (!addressInfo || typeof addressInfo === "string") {
    throw new Error("Failed to determine server address");
  }
  baseURL = `http://127.0.0.1:${addressInfo.port}`;
});

beforeEach(async () => {
  // Clear the database before each test
  await prisma.$transaction([prisma.application.deleteMany()]);
});

afterAll(async () => {
  // Properly close the server
  await server.close();
});

describe("Hugo API Tests", () => {
  describe("Create", () => {
    test("Create a new application", async () => {
      const response = await fetch(`${baseURL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryDriver: {
            firstName: "Test",
            lastName: "User",
            dateOfBirth: "1980-06-01",
          },
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.id).toBeDefined();
      expect(body.id).toBeTypeOf("number");
    });

    test("Should not create an application with invalid data", async () => {
      const response = await fetch(`${baseURL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryDriver: {
            firstName: "T",
          },
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Request doesn't match the schema");
      expect(body.summary).toBe(
        "primaryDriver.firstName: String must contain at least 2 character(s)",
      );
    });

    test("Should not create an application with invalid date of birth format", async () => {
      const response = await fetch(`${baseURL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryDriver: {
            dateOfBirth: "01-02-2000",
          },
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Request doesn't match the schema");
      expect(body.summary).toBe(
        "primaryDriver.dateOfBirth: Date must be in YYYY-MM-DD format",
      );
    });

    test("Should not create an application when primary driver is not 18", async () => {
      const response = await fetch(`${baseURL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryDriver: {
            dateOfBirth: "2020-01-01",
          },
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Request doesn't match the schema");
      expect(body.summary).toBe(
        "primaryDriver.dateOfBirth: Must be at least 18 years old",
      );
    });

    test("Should create an application with a valid Vin", async () => {
      const response = await fetch(`${baseURL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicles: {
            ABC123: {
              vin: "2C3KA53G38H165077", // Random valid VIN
            },
          },
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.id).toBeDefined();
      expect(body.id).toBeTypeOf("number");
    });

    test("Should not create an application with an invalid Vin", async () => {
      const response = await fetch(`${baseURL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicles: {
            ABC123: {
              vin: "12345678901234567",
            },
          },
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Request doesn't match the schema");
      expect(body.summary).toBe("vehicles.ABC123.vin: Invalid VIN check digit");
    });
  });

  describe("Search", () => {
    test("Search for an existing application", async () => {
      const seedData: InProgressApplication = {
        primaryDriver: {
          firstName: "Test",
          lastName: "User",
          dateOfBirth: "1980-06-01",
        },
      };
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
        },
      });

      const response = await fetch(`${baseURL}/applications/${testRecord.id}`);
      const body = await response.json();

      expect(response.status).toBe(206);
      expect(body.data.primaryDriver).toEqual(seedData.primaryDriver);
      // Errors are expected because the application is incomplete
      expect(body.errors).toBeDefined();
      expect(body.errors[0]).toEqual({
        field: "primaryDriver.gender",
        message: "Required",
      });
    });

    test("Should return 404 when application is not found", async () => {
      const response = await fetch(`${baseURL}/applications/999`);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("Application not found");
    });

    test("Should return a 200 when application is completed", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify(seedData.vehicles),
          completed: seedData.completed,
          quote: seedData.quote,
        },
      });

      const response = await fetch(`${baseURL}/applications/${testRecord.id}`);

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual({ ...seedData, additionalDrivers: {} });
    });
  });

  describe("Update", () => {
    test("Update an existing application", async () => {
      const seedData: InProgressApplication = {
        primaryDriver: {
          firstName: "Test",
          lastName: "User",
          dateOfBirth: "1980-06-01",
        },
      };
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
        },
      });

      const response = await fetch(`${baseURL}/applications/${testRecord.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seedData),
      });

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual({
        ...seedData,
        mailingAddress: {},
        garagingAddress: {},
        vehicles: {},
        additionalDrivers: {},
      });
    });

    test("Should return 404 when application is not found", async () => {
      const response = await fetch(`${baseURL}/applications/999`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("Application not found");
    });

    test("Should return 400 when application is completed", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify(seedData.vehicles),
          completed: seedData.completed,
          quote: seedData.quote,
        },
      });

      const response = await fetch(`${baseURL}/applications/${testRecord.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Unable to update application as it has already been submitted",
      );
    });

    test("Should not update an application with invalid data", async () => {
      const seedData: InProgressApplication = {
        primaryDriver: {
          firstName: "Test",
          lastName: "User",
          dateOfBirth: "1980-06-01",
        },
      };
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
        },
      });

      const response = await fetch(`${baseURL}/applications/${testRecord.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryDriver: {
            firstName: "T",
          },
        }),
      });

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Request doesn't match the schema");
    });
  });

  describe("Delete", () => {
    test("Delete an existing application field", async () => {
      const seedData: InProgressApplication = {
        primaryDriver: {
          firstName: "Test",
          lastName: "User",
          dateOfBirth: "1980-06-01",
        },
      };

      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
        },
      });

      const response = await fetch(
        `${baseURL}/applications/${testRecord.id}/data`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: "primaryDriver.firstName" }),
        },
      );

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.primaryDriver.firstName).toBeUndefined();
      expect(body.data.primaryDriver.lastName).toBe("User");
    });

    test("Should return 404 when application is not found", async () => {
      const response = await fetch(`${baseURL}/applications/0/data`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: "primaryDriver.firstName" }),
      });

      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("Application not found");
    });

    test("Should return 400 when application is completed", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify(seedData.vehicles),
          completed: seedData.completed,
          quote: seedData.quote,
        },
      });

      const response = await fetch(
        `${baseURL}/applications/${testRecord.id}/data`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: "primaryDriver.firstName" }),
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Unable to update application as it has already been submitted",
      );
    });
  });

  describe("Submit", () => {
    test("Should be able to submit a valid application", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify(seedData.vehicles),
          completed: false,
          quote: null,
        },
      });

      const response = await fetch(
        `${baseURL}/applications/${testRecord.id}/submit`,
        {
          method: "POST",
        },
      );

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.quote).toBeTypeOf("number");
      expect(body.data.completed).toBe(true);
    });

    test("Should return 404 when application is not found", async () => {
      const response = await fetch(`${baseURL}/applications/999/submit`, {
        method: "POST",
      });

      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("Application not found");
    });

    test("Should return 400 when application is already completed", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify(seedData.vehicles),
          completed: seedData.completed,
          quote: seedData.quote,
        },
      });

      const response = await fetch(
        `${baseURL}/applications/${testRecord.id}/submit`,
        {
          method: "POST",
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Unable to update application as it has already been submitted",
      );
    });

    test("should return a 400 when application is has too many vehicles", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const vehicles: Vehicles = {
        ABC123: {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "2C3KA53G38H165077",
        },
        DEF456: {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "2C3KA53G38H165077",
        },
        GHI789: {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "2C3KA53G38H165077",
        },
        JKL012: {
          make: "Toyota",
          model: "Corolla",
          year: 2010,
          vin: "2C3KA53G38H165077",
        },
      };
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify(vehicles),
          completed: false,
          quote: null,
        },
      });

      const response = await fetch(
        `${baseURL}/applications/${testRecord.id}/submit`,
        {
          method: "POST",
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Unable to submit application as it is not valid",
      );
      expect(body.errors[0]).toEqual({
        field: "vehicles",
        message: "No more than 3 vehicles are allowed.",
      });
    });

    test("should return a 400 when application has errors", async () => {
      const seedData: CompletedApplication = stubValidCompleteApplication;
      const testRecord = await prisma.application.create({
        data: {
          primaryDriver: JSON.stringify(seedData.primaryDriver),
          mailingAddress: JSON.stringify(seedData.mailingAddress),
          garagingAddress: JSON.stringify(seedData.garagingAddress),
          vehicles: JSON.stringify({}),
          completed: false,
          quote: null,
        },
      });

      const response = await fetch(
        `${baseURL}/applications/${testRecord.id}/submit`,
        {
          method: "POST",
        },
      );

      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Unable to submit application as it is not valid",
      );
      expect(body.errors[0]).toEqual({
        field: "vehicles",
        message: "At least one vehicle is required.",
      });
    });
  });
});
