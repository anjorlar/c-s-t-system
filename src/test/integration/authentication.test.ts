process.env.NODE_ENV = 'test'

import expect from "expect";
import request from "supertest";
import { app } from "../../app";
import { seedUsers, users, admin, seedAdmin } from '../seed/seed';

describe('Authentication', () => {
    describe('user', () => {
        beforeEach(async () => {
            await seedUsers();
        });
        describe('Register users', () => {
            it('should register and return a new user', (done) => {
                const user = {
                    name: "ade bayo",
                    email: "dev@mail.com",
                    password: "password"
                };
                request(app)
                    .post("/api/v1/register")
                    .send(user)
                    .expect(201)
                    .expect((response) => {
                        expect(response.body.data.user).toMatchObject({
                            name: "ade bayo",
                            email: "dev@mail.com",
                        })
                        expect(response.body.data).toHaveProperty("token")
                    })
                    .end(done)
            });

            it("should return 400 if required fields are missing", async () => {
                await request(app)
                    .post("/api/v1/register")
                    .send({})
                    .expect(400)
            });

            it("should not create a user if email has already been used", async () => {
                await request(app)
                    .post("/api/v1/register")
                    .send({ email: users[0].email, password: "password1" })
                    .expect(400)
            });
        });

        describe('Login users', () => {
            it('should login user and return auth token', async () => {
                const res = await request(app)
                    .post("/api/v1/login")
                    .send({
                        email: users[1].email,
                        password: users[1].password
                    })
                    .expect(200)
                expect(res.body.data).toHaveProperty('token')
            });

            it('invalid login details should be rejected', async () => {
                const res = await request(app)
                    .post("/api/v1/login")
                    .send({
                        email: users[1].email,
                        password: users[1].password + 'fake'
                    })
                    .expect(401)
            })
        })
    });

    describe('Admin', () => {
        beforeEach(async () => {
            await seedAdmin()
        });

        describe('Login admin', () => {
            it('admin should be logged in and auth token returned', (done) => {
                const val = {
                    email: admin[0].email,
                    password: admin[0].password
                }
                request(app)
                    .post("/api/v1/admin/login")
                    .send(val)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.data).toHaveProperty("token")
                    })
                    .end(done)
            });

            it('invalid login details should be rejected', (done) => {
                const data = {
                    email: admin[0].email,
                    password: admin[0].password + 'fake'
                }
                request(app)
                    .post("/api/v1/admin/login")
                    .send(data)
                    .expect(401)
                    .end(done)
            });
        });
    });
});