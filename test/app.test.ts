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
                    expect(validationResults.message).toContain("body/primaryDriver/firstName String must contain at least 2 character(s)");
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
                    expect(validationResults.message).toContain("body/primaryDriver/lastName String must contain at least 2 character(s)");
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
                    expect(validationResults.message).toContain("body/primaryDriver/dateOfBirth Date must be in YYYY-MM-DD format");
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
                    expect(validationResults.message).toContain("body/primaryDriver/dateOfBirth Must be at least 18 years old");
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
                    expect(validationResults.message).toContain(`body/primaryDriver/gender Invalid enum value. Expected 'male' | 'female' | 'non-binary', received 'other'`);
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
                    expect(validationResults.message).toContain(`body/primaryDriver/maritalStatus Invalid enum value. Expected 'single' | 'married' | 'divorced' | 'widowed', received 'other'`);
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
                        expect(validationResults.message).toContain("body/primaryDriver/driversLicense/number String must contain exactly 9 character(s), body/primaryDriver/driversLicense/state Required");
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
                        expect(validationResults.message).toContain(`body/primaryDriver/driversLicense/number Required, body/primaryDriver/driversLicense/state Invalid enum value. Expected 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY', received 'C'`);
                    });
                });
            });
        });

    });
})