import { expect } from 'chai';
import { ResponseBuilder } from '../src/shared/response-builder';

describe('response-builder', () => {
    it('should able to send bad request', () => {
        const expectErr = {
            error: {
                code: 'ERROR_CODE',
                description: 'ERROR_MSG',
            },
        };
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.statusCode).to.equal(400);
            expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
        };

        ResponseBuilder.badRequest('ERROR_CODE', 'ERROR_MSG', mockCallback);
    });

    it('should able to send configurationError', () => {
        const expectErr = {
            error: {
                code: 'ERROR_CODE',
                description: 'ERROR_MSG',
            },
        };
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.statusCode).to.equal(500.19);
            expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
        };

        ResponseBuilder.configurationError('ERROR_CODE', 'ERROR_MSG', mockCallback);
    });

    it('should able to send forbidden', () => {
        const expectErr = {
            error: {
                code: 'ERROR_CODE',
                description: 'ERROR_MSG',
            },
        };
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.statusCode).to.equal(403);
            expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
        };

        ResponseBuilder.forbidden('ERROR_CODE', 'ERROR_MSG', mockCallback);
    });

    it('should able to send internalServerError', () => {
        const expectErr = {
            error: {
                code: 'GENERAL_ERROR',
                description: 'Sorry...',
            },
        };
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.statusCode).to.equal(500);
            expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
        };

        ResponseBuilder.internalServerError(undefined, mockCallback);
    });

    it('should able to send notFound', () => {
        const expectErr = {
            error: {
                code: 'ERROR_CODE',
                description: 'ERROR_MSG',
            },
        };
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.statusCode).to.equal(404);
            expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
        };

        ResponseBuilder.notFound('ERROR_CODE', 'ERROR_MSG', mockCallback);
    });

    it('should able to send ok', () => {
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.statusCode).to.equal(200);
            expect(apiResult.body).to.deep.equal(JSON.stringify({}));
        };

        ResponseBuilder.ok<any>({}, mockCallback);
    });
});
