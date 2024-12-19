import { CompletedApplication } from "../../src/schemas/application";

export const stubValidCompleteApplication: CompletedApplication = {
  primaryDriver: {
    firstName: "Test",
    lastName: "User",
    dateOfBirth: "1980-06-01",
    gender: "male",
    maritalStatus: "single",
    driversLicense: {
      number: "ABC123456",
      state: "CA",
    },
  },
  mailingAddress: {
    street: "123 Test St",
    city: "Testville",
    state: "CA",
    zip: "12345",
  },
  garagingAddress: {
    street: "123 Test St",
    city: "Testville",
    state: "CA",
    zip: "12345",
  },
  vehicles: {
    ABC123: {
      make: "Toyota",
      model: "Corolla",
      year: 2010,
      vin: "2C3KA53G38H165077",
    },
  },
  completed: true,
  quote: 100,
};
