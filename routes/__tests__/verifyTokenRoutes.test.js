const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../routes/verifyToken');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
    describe('verifyToken', () => {
        it('should validate token and call next', () => {
            const user = { id: '1', isAdmin: false };
            const req = httpMocks.createRequest({
                headers: {
                    token: 'Bearer validToken'
                }
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, user));

            verifyToken(req, res, next);
            expect(jwt.verify).toBeCalledWith('validToken', process.env.JWT_SEC, expect.any(Function));
            expect(req.user).toEqual(user);
            expect(next).toBeCalled();
        });

        it('should return 403 if token is invalid', () => {
            const req = httpMocks.createRequest({
                headers: {
                    token: 'Bearer invalidToken'
                }
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            jwt.verify.mockImplementation((token, secret, cb) => cb(new Error("Token is not valid!"), null));

            verifyToken(req, res, next);
            expect(res.statusCode).toBe(403);
            expect(res._getData()).toEqual("Token is not valid!");
            expect(next).not.toBeCalled();
        });

        it('should return 401 if no token provided', () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();

            verifyToken(req, res, next);
            expect(res.statusCode).toBe(401);
            expect(res._getData()).toEqual("You are not authenticated!");
            expect(next).not.toBeCalled();
        });
    });

    describe('verifyTokenAndAuthorization', () => {
        it('should allow access if user is same as request id or admin', () => {
            const req = httpMocks.createRequest({
                params: {
                    id: '1'
                },
                user: {
                    id: '1',
                    isAdmin: false
                }
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            verifyTokenAndAuthorization(req, res, next);
            expect(next).toBeCalled();
        });

        it('should deny access if user is not same as request id and not admin', () => {
            const req = httpMocks.createRequest({
                params: {
                    id: '2'
                },
                user: {
                    id: '1',
                    isAdmin: false
                }
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            verifyTokenAndAuthorization(req, res, next);
            expect(res.statusCode).toBe(403);
            expect(res._getData()).toEqual("You are not allowed to do that!");
            expect(next).not.toBeCalled();
        });
    });

    describe('verifyTokenAndAdmin', () => {
        it('should allow access if user is admin', () => {
            const req = httpMocks.createRequest({
                user: {
                    isAdmin: true
                }
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            verifyTokenAndAdmin(req, res, next);
            expect(next).toBeCalled();
        });

        it('should deny access if user is not admin', () => {
            const req = httpMocks.createRequest({
                user: {
                    isAdmin: false
                }
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            verifyTokenAndAdmin(req, res, next);
            expect(res.statusCode).toBe(403);
            expect(res._getData()).toEqual("You are not allowed to do that!");
            expect(next).not.toBeCalled();
        });
    });
});
