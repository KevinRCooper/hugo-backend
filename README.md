# Hugo API Backend
[![Fastify](https://img.shields.io/badge/Fastify-%5E4.x-blue?style=flat&logo=fastify&logoColor=white)](https://fastify.dev)
[![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-blue?logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Testing](https://img.shields.io/badge/-vitest-6e9f18?style=flat&logo=vitest&logoColor=ffffff)](https://vitest.dev)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

This is a simple API backend for an auto insurance quote application. It is implemented in TypeScript using Fastify and SQLite.

## :rocket: Getting Started

### Install Dependencies

```shell
npm install
```

### Set Environment Variables

Create a `.env` file in the root directory and set the following environment variables:
> Note: See the `example.env` file for an example.

```shell
PORT=8080
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

### Run the Server

```shell
npm run start
```
> The `npm run start` script will do a hot reload of the server when changes are made.

## :hammer: API Documentation
```mermaid
graph TD
  A[Applications]
  
  A --> B[POST /applications]
  B --> C[Create Application]
  C --> D[Save Application to Database]
  D --> E[Return Application ID]

  A --> F[GET /applications/:id]
  F --> G[Retrieve Application from Database]
  G --> H[Return Application Data]

  A --> I[PATCH /applications/:id]
  I --> J[Update Application Data]
  J --> K[Save Updated Application to Database]
  K --> L[Return Updated Application Data]

  A --> M[DELETE /applications/:id/data]
  M --> N[Delete Data from Application]
  N --> O[Save Updated Application to Database]
  O --> P[Return Updated Application Data]

  A --> Q[POST /applications/:id/submit]
  Q --> R[Submit Application]
  R --> S[Calculate Quote Price]
  S --> T[Return Quote Price]

```

The API documentation is available at the `/docs` route. You can access it by navigating to `http://localhost:<PORT>/docs` in your browser.

From there, you can interact with the API by sending requests to the various endpoints by using the `Try it out` button.

During development, you can use the Prisma Studio to interact with the database. To start Prisma Studio, run the following command in another terminal window:

```shell
npx prisma studio
```

## :white_check_mark: Testing

### Run Tests

```shell
npm run test
```
Using this script will test the server, and automatically re-run the tests when changes are made.

### Notes About Testing

- The tests are writting in Vitest
- The tests are located in the `tests` directory
- The main test suite is `api.test.ts`. This is a full end-to-end test suite that tests the API endpoints.
> Warning: The tests will clear out the database before each test to ensure each test is run in isolation. This means that any data in the database will be lost.
- The `app.test.ts` file is a demonstration of how to test the Fastify server using the `fastify.inject` method. This is useful for testing the server without making actual HTTP requests.
- The `utils.test.ts` file contains utility functions that are used in the tests.
- The `mocks` directory contains mock data that is used in the tests.
- The `schemas` folder contains tests against the Zod schemas used in the application.

### Testing Diagram
#### Setup
```mermaid
graph LR
  Setup[beforeAll: Setup Server] --> Init[Initialize Fastify Server]
  Init --> Address[Determine Server Address]
  Address --> BaseURL[Set Base URL]

```

#### Lifecycle
```mermaid
graph LR
  BeforeEach[beforeEach: Reset Database] --> Inject[Inject Test Data]
  Inject --> Execute[Test Execution]
  Execute --> Assertions[Assertions]

```

#### Teardown
```mermaid
graph LR
  Teardown[afterAll: Teardown] --> Close[Close Server]
  Close --> End[Tests Completed]

```

## :construction: Development
While developing, you might find it useful to use the following scripts:

### Format Code

```shell
npm run format
```

### Lint Code

```shell
npm run lint
```

## :notebook: Project Notes
Some minor changes were made to the API spec:  
- Some routes return `206` to indicate that the request was successful but the response is partial. This is to indicate that the application is not yet complete.
- I expanded upon the status codes returned by the API to include `400`, `404`, and `500` status codes.

Changes to Testing:
- `app.test.ts` was re-written from scratch (while preserving the original intents). 
- The reason for this was to make the tests run in isolation, so tests do not depend on each other. 
- This also meant that I didn't need to run the tests in a specific order to not impact performance.
> **Note**: Tests now **automatically start and stop the server**, so the developer doesn't have to worry about starting and stopping the server manually before running the tests which I felt would be a welcomed improvement.

Stretch Goal:
- :white_check_mark: VIN validation using the ISO 3779 algorithm was implimented!

## :bulb: Improvements
- Add more tests to cover more edge cases.
- Add more integration tests using `fastify.inject` to test the server without making actual HTTP requests.
- Improve the OpenAPI documentation to include more details about the API.
- Design the database schema to be more normalized and efficient.
- Include a `test` specific database that is used only for testing purposes.
