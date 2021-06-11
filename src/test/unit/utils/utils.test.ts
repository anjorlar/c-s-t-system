process.env.NODE_ENV = 'test'

import expect from "expect";
import sinon from "sinon";
import Joi from "joi";
import Utils from "../../../utils/utils";

describe('Utils', () => {
    describe('validate password function test', () => {
        it('should be false when password don not match', async () => {
            const validate = await Utils.validatePassword("password", "password");
            expect(validate).toBeFalsy()
        });

        it('should be true when password matches hashed password', async () => {
            const hashedPassword = await Utils.hashPassword("password")
            const validate = await Utils.validatePassword("password", hashedPassword)
            expect(validate).toBeTruthy()
        });
    });

    describe('paginate function test', () => {
        const data = [{}, {}, {}]
        it("should return an object having count as 3", async () => {
            const paginatorFunc = await Utils.paginator(data)
            expect(paginatorFunc.count).toBe(data.length)
        });

        it("should return an object having next field where limit is passed", async () => {
            const paginatorFunc = await Utils.paginator(data, 1)
            expect(paginatorFunc.next).toMatchObject({ page: 2, limit: 1 })
        });

        it("should return an object having previous field where page > (greater than) 1 is passed", async () => {
            const paginatorFunc = await Utils.paginator(data, 1, 2)
            expect(paginatorFunc.previous).toMatchObject({ page: 1, limit: 1 });
        });
    });

    describe("validate request function test", () => {
        it("should throw error when required field is missing", async () => {
            const testSchema = Joi.object({
                field: Joi.string().required(),
            })
            const body = {}
            const err = await Utils.validateRequest(body, testSchema)
            expect(err).toBeTruthy()
        })
    })
})