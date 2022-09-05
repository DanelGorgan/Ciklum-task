import { HeaderValidationMiddleware } from "./header.validation.middleware";
import { createRequest, createResponse } from 'node-mocks-http';
import { NotAcceptableException } from "@nestjs/common";
describe('HeaderValidationMiddleware UNIT tests', () => {
    let middleware: HeaderValidationMiddleware;
    beforeEach(() => {
        middleware = new HeaderValidationMiddleware();
    })

    it('should pass validations for accept header', async () => {
        const req = createRequest({
            headers: { accept: 'application/json' }
        });
        const res = createResponse();
        const next = jest.fn();
        middleware.use(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalledWith(new NotAcceptableException());
    });

    it('should pass validations for swagger accept header', async () => {
        const req = createRequest({
            headers: { 'swagger-accept': 'application/json' }
        });
        const res = createResponse();
        const next = jest.fn();
        middleware.use(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalledWith(new NotAcceptableException());
    });

    it('should return validation error for xml accept header', async () => {
        const req = createRequest({
            headers: { 'accept': 'application/xml' }
        });
        const res = createResponse();
        const next = jest.fn();
        middleware.use(req, res, next)
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new NotAcceptableException())
    });

    it('should return validation error for xml swagger-accept header', async () => {
        const req = createRequest({
            headers: { 'swagger-accept': 'application/xml' }
        });
        const res = createResponse();
        const next = jest.fn();
        middleware.use(req, res, next)
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new NotAcceptableException())
    });
});
