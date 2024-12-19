import { describe, expect, test } from 'vitest';
import { build } from '../src/app';

describe("Hugo API", async () => {
    const app = await build();
    await app.ready();

    describe("POST /applications", () => {
        test("should create a new application", async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/applications',
                payload: {
                    primaryDriver: {
                        firstName: 'Test',
                        lastName: 'User',
                        dateOfBirth: '1980-06-01',
                    },
                },
            });

            expect(response.statusCode).toBe(200);
        });

        describe("Primary Driver", () => {
            describe("First Name", () => {
                test("should create a new application with valid first name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                firstName: 'Test',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with invalid first name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                firstName: 'T',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("primaryDriver.firstName: String must contain at least 2 character(s)");
                });
            });

            describe("Last Name", () => {
                test("should create a new application with valid last name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                lastName: 'User',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with invalid last name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                lastName: 'U',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("primaryDriver.lastName: String must contain at least 2 character(s)");
                });
            });

            describe("Date of Birth", () => {
                test("should create a new application with valid date of birth", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                dateOfBirth: '1980-06-01',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with invalid date of birth", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                dateOfBirth: '1980',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("primaryDriver.dateOfBirth: Date must be in YYYY-MM-DD format");
                });

                test("should not create a new application if age is < 18", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                dateOfBirth: '2020-06-01',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("primaryDriver.dateOfBirth: Must be at least 18 years old");
                });
            });

            describe("Gender", () => {
                test("should create a new application with a valid gender", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                gender: "male",
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid gender", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                gender: "other",
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toEqual(`primaryDriver.gender: Invalid enum value. Expected 'male' | 'female' | 'non-binary', received 'other'`)
                    //expect(validationResults.summary).toBe(`primaryDriver.gender: Invalid enum value. Expected 'male' | 'female' | 'non-binary', received 'other'`);
                });
            });

            describe("Marital Status", () => {
                test("should create a new application with a valid marital status", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                maritalStatus: "single",
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid marital status", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            primaryDriver: {
                                maritalStatus: "other",
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe(`primaryDriver.maritalStatus: Invalid enum value. Expected 'single' | 'married' | 'divorced' | 'widowed', received 'other'`);
                });
            });

            describe("Drivers License", () => {
                describe("Number", () => {
                    test("should create a new application with a valid drivers license number", async () => {
                        const response = await app.inject({
                            method: 'POST',
                            url: '/applications',
                            payload: {
                                primaryDriver: {
                                    driversLicense: {
                                        number: 'ABC123456',
                                        state: 'CA',
                                    },
                                },
                            },
                        });

                        expect(response.statusCode).toBe(200);
                    });

                    test("should not create a new application with an invalid drivers license number", async () => {
                        const response = await app.inject({
                            method: 'POST',
                            url: '/applications',
                            payload: {
                                primaryDriver: {
                                    driversLicense: {
                                        number: 'ABC123',
                                    },
                                },
                            },
                        });
                        const validationResults = await response.json()

                        expect(validationResults.statusCode).toBe(400);
                        expect(validationResults.summary).toBe("primaryDriver.driversLicense.number: String must contain exactly 9 character(s); primaryDriver.driversLicense.state: Required");
                    });
                });

                describe("State", () => {
                    test("should create a new application with a valid drivers license state", async () => {
                        const response = await app.inject({
                            method: 'POST',
                            url: '/applications',
                            payload: {
                                primaryDriver: {
                                    driversLicense: {
                                        number: 'ABC123456',
                                        state: 'CA',
                                    },
                                },
                            },
                        });

                        expect(response.statusCode).toBe(200);
                    });

                    test("should not create a new application with an invalid drivers license state", async () => {
                        const response = await app.inject({
                            method: 'POST',
                            url: '/applications',
                            payload: {
                                primaryDriver: {
                                    driversLicense: {
                                        state: 'C',
                                    },
                                },
                            },
                        });
                        const validationResults = await response.json()

                        expect(validationResults.statusCode).toBe(400);
                        expect(validationResults.summary).toBe(`primaryDriver.driversLicense.number: Required; primaryDriver.driversLicense.state: Invalid enum value. Expected 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY', received 'C'`);
                    });
                });
            });
        });

        describe("Mailing Address", () => {
            test("should create a new application with a valid mailing address", async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/applications',
                    payload: {
                        mailingAddress: {
                            street: '123 Main St',
                            city: 'Anytown',
                            state: 'CA',
                            zip: '12345',
                        },
                    },
                });

                expect(response.statusCode).toBe(200);
            });

            test("should not create a new application with an invalid mailing address", async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/applications',
                    payload: {
                        mailingAddress: {
                            street: '123 Main St',
                            city: 'Anytown',
                            state: 'C',
                            zip: '12345',
                        },
                    },
                });
                const validationResults = await response.json()

                expect(validationResults.statusCode).toBe(400);
                expect(validationResults.summary).toBe(`mailingAddress.state: Invalid enum value. Expected 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY', received 'C'`);
            });

            describe("Street", () => {
                test("should create a new application with a valid mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '1',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("mailingAddress.street: String must contain at least 2 character(s)");
                });
            });

            describe("Unit", () => {
                test("should create a new application with a valid unit in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                unit: 'Apt 1',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid unit in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                unit: 1,
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("mailingAddress.unit: Expected string, received number");
                });
            });

            describe("City", () => {
                test("should create a new application with a valid city in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid city in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'A',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("mailingAddress.city: String must contain at least 2 character(s)");
                });
            });

            describe("State", () => {
                test("should create a new application with a valid state in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid state in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'C',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe(`mailingAddress.state: Invalid enum value. Expected 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY', received 'C'`);
                });
            });

            describe("Zip", () => {
                test("should create a new application with a valid zip in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: '12345',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid zip length in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: '1234',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("mailingAddress.zip: String must contain exactly 5 character(s); mailingAddress.zip: Invalid");
                });

                test("should not create a new application with an invalid zip in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: '1234A',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("mailingAddress.zip: Invalid");
                });

                test("should not create a new application with an invalid zip type in mailing address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            mailingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: 12345,
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("mailingAddress.zip: Expected string, received number");
                });
            });
        });

        describe("Garaging Address", () => {
            test("should create a new application with a valid garaging address", async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/applications',
                    payload: {
                        garagingAddress: {
                            street: '123 Main St',
                            city: 'Anytown',
                            state: 'CA',
                            zip: '12345',
                        },
                    },
                });

                expect(response.statusCode).toBe(200);
            });

            test("should not create a new application with an invalid garaging address", async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/applications',
                    payload: {
                        garagingAddress: {
                            street: '123 Main St',
                            city: 'Anytown',
                            state: 'C',
                            zip: '12345',
                        },
                    },
                });
                const validationResults = await response.json()

                expect(validationResults.statusCode).toBe(400);
                expect(validationResults.summary).toBe(`garagingAddress.state: Invalid enum value. Expected 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY', received 'C'`);
            });

            describe("Street", () => {
                test("should create a new application with a valid garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '1',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("garagingAddress.street: String must contain at least 2 character(s)");
                });
            });

            describe("Unit", () => {
                test("should create a new application with a valid unit in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                unit: 'Apt 1',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid unit in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                unit: 1,
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("garagingAddress.unit: Expected string, received number");
                });
            });

            describe("City", () => {
                test("should create a new application with a valid city in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid city in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'A',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("garagingAddress.city: String must contain at least 2 character(s)");
                });
            });

            describe("State", () => {
                test("should create a new application with a valid state in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid state in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'C',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe(`garagingAddress.state: Invalid enum value. Expected 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY', received 'C'`);
                });
            });

            describe("Zip", () => {
                test("should create a new application with a valid zip in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: '12345',
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid zip length in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: '1234',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("garagingAddress.zip: String must contain exactly 5 character(s); garagingAddress.zip: Invalid");
                });

                test("should not create a new application with an invalid zip in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: '1234A',
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("garagingAddress.zip: Invalid");
                });

                test("should not create a new application with an invalid zip type in garaging address", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            garagingAddress: {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zip: 12345,
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("garagingAddress.zip: Expected string, received number");
                });
            });
        });

        describe("Vehicles", () => {
            test("should create a new application with a valid vehicle", async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/applications',
                    payload: {
                        vehicles: {
                            'ABC123': {
                                make: 'Toyota',
                                model: 'Camry',
                                year: 2020,
                                vin: '2C3KA53G38H165077',
                            }
                        }
                    },
                });

                expect(response.statusCode).toBe(200);
            });

            test("should create a new application with multiple valid vehicles", async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/applications',
                    payload: {
                        vehicles: {
                            'ABC123': {
                                make: 'Toyota',
                                model: 'Camry',
                                year: 2020,
                                vin: '2C3KA53G38H165077',
                            },
                            'DEF456': {
                                make: 'Honda',
                                model: 'Civic',
                                year: 2015,
                                vin: '1FTEX15H7RKA82350',
                            },
                            'GHI789': {
                                make: 'Ford',
                                model: 'F-150',
                                year: 2018,
                                vin: '2A4GP44R36R638066',
                            },
                        }
                    },
                });

                expect(response.statusCode).toBe(200);
            });

            describe("Make", () => {
                test("should create a new application with a valid make", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    make: 'Toyota',
                                }
                            }
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid make", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    make: 'T',
                                }
                            }
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("vehicles.ABC123.make: String must contain at least 2 character(s)");
                });
            });

            describe("Model", () => {
                test("should create a new application with a valid model", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    model: 'Camry',
                                }
                            }
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid model", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    model: 'C',
                                }
                            }
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("vehicles.ABC123.model: String must contain at least 2 character(s)");
                });
            });

            describe("Year", () => {
                test("should create a new application with a valid year", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    year: 2020,
                                }
                            }
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid year", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    year: 1984,
                                }
                            }
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("vehicles.ABC123.year: Number must be greater than or equal to 1985");
                });
            });

            describe("Vin", () => {
                test("should create a new application with a valid vin", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    vin: '2C3KA53G38H165077', // Random valid VIN
                                }
                            }
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid vin length", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    vin: '1234567890123456',
                                }
                            }
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("vehicles.ABC123.vin: String must contain exactly 17 character(s); vehicles.ABC123.vin: Invalid VIN check digit");
                });

                test("should not create a new application with an invalid vin sequence", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            vehicles: {
                                'ABC123': {
                                    vin: '1234567890123456A',
                                }
                            }
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("vehicles.ABC123.vin: Invalid VIN check digit");
                });
            });
        });

        describe("Additional Drivers", () => {
            describe("First Name", () => {
                test("should create a new application with valid first name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    firstName: 'Tdd',
                                },
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with invalid first name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    firstName: 'T',
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("additionalDrivers.Driver1.firstName: String must contain at least 2 character(s)");
                });
            });

            describe("Last Name", () => {
                test("should create a new application with valid last name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    lastName: 'User',
                                },
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with invalid last name", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    lastName: 'U',
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("additionalDrivers.Driver1.lastName: String must contain at least 2 character(s)");
                });
            });

            describe("Date of Birth", () => {
                test("should create a new application with valid date of birth", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    dateOfBirth: '1980-06-01',
                                },
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with invalid date of birth", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    dateOfBirth: '1980',
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("additionalDrivers.Driver1.dateOfBirth: Date must be in YYYY-MM-DD format");
                });

                test("should not create a new application if age is < 18", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    dateOfBirth: '2020-06-01',
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("additionalDrivers.Driver1.dateOfBirth: Must be at least 18 years old");
                });
            });

            describe("Gender", () => {
                test("should create a new application with a valid gender", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    gender: "male",
                                },
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid gender", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    gender: "other",
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toEqual(`additionalDrivers.Driver1.gender: Invalid enum value. Expected 'male' | 'female' | 'non-binary', received 'other'`)
                });
            });

            describe("Relationship", () => {
                test("should create a new application with a valid relationship", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    relationship: "spouse",
                                },
                            },
                        },
                    });

                    expect(response.statusCode).toBe(200);
                });

                test("should not create a new application with an invalid relationship", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    relationship: "cousin",
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe(`additionalDrivers.Driver1.relationship: Invalid enum value. Expected 'spouse' | 'child' | 'parent' | 'sibling' | 'other', received 'cousin'`);
                });
            });

            describe("Marital Status", () => {
                test("should not create a new application if marital status received", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    maritalStatus: "other",
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("additionalDrivers.Driver1: Unrecognized key(s) in object: 'maritalStatus'");
                });
            });

            describe("Drivers License", () => {
                test("should not create a new application if drivers license received", async () => {
                    const response = await app.inject({
                        method: 'POST',
                        url: '/applications',
                        payload: {
                            additionalDrivers: {
                                "Driver1": {
                                    driversLicense: {
                                        number: 'ABC123456',
                                        state: 'CA',
                                    },
                                },
                            },
                        },
                    });
                    const validationResults = await response.json()

                    expect(validationResults.statusCode).toBe(400);
                    expect(validationResults.summary).toBe("additionalDrivers.Driver1: Unrecognized key(s) in object: 'driversLicense'");
                });
            });
        });

    });
})