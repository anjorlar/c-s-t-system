import expect from "expect";
import sinon from "sinon";
import { authToken } from "../../../middlewares/Auth";

describe("authToken function test", () => {
    it('should return a 401 error code if token is\'t passed', () => {
        const req = {
            headers: sinon.stub().returns(null)
        }
        const mockResponse = () => {
            const res: any = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            return res
        };
        const res: any = mockResponse();
        const next = sinon.stub();
        authToken(req, res, next);
        expect(res.status.calledWith(401)).toBeTruthy();
        // expect(res.send.message).toBeTruthy();
    });

    it(`should return a 401 error code if invalid token is passed`, () => {
        const req = {
            headers: sinon.stub().returns('1234')
        };

        const mockResponse = () => {
            const res: any = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            return res
        };
        const res = mockResponse()
        const next = sinon.stub()
        authToken(req, res, next);
        expect(res.status.calledWith(401)).toBeTruthy();
        // expect(res.send.calledWith({})).toBeTruthy();

    })
})

