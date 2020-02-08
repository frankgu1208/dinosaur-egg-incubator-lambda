import { expect } from 'chai';
import { IncubatorRepo } from '../src/repository/incubator-repo';
import { IncubatorData } from '../src/data-access/incubator-data';
import { IncubatorController } from '../src/controllers/incubator-controller';
import { ApiResult } from '../src/interfaces/api';
import * as errors from '../src/constant/errors';

const mockEmptyEvent = {
    headers: undefined,
    multiValueHeaders: undefined,
    httpMethod: '',
    isBase64Encoded: false,
    path: '',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    resource: '',
};
let incubatorController: IncubatorController;

describe('handler', () => {
    before(() => {
        const incubatorData = new IncubatorData('dinosaur-egg-incubator');
        const incubatorRepo = new IncubatorRepo(incubatorData);
        incubatorController = new IncubatorController(incubatorRepo);
    });

    it('should able to put setting', async function() {
        this.timeout(10000);
        const mockEvent = {
            ...mockEmptyEvent,
            body: '{"number_of_eggs":5,"sequence":"1 2 3 8 7 3","rotation_amount":0.25}',
        };
        const expectApiResult = {
            report: {
                number_of_eggs: 5,
                sequence: '1 2 3 8 7 3',
                rotation_amount: 0.25,
                rotations: [
                    { egg: 1, was_rotated: 0 },
                    { egg: 2, was_rotated: 0 },
                    { egg: 3, was_rotated: 0 },
                    { egg: 4, was_rotated: 0 },
                    { egg: 5, was_rotated: 0 },
                ],
            },
        } as ApiResult;
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.body).to.equal(JSON.stringify(expectApiResult));
        };
        await incubatorController.putSettings(mockEvent, undefined, mockCallback);
    });

    it('should able to post run', async function() {
        this.timeout(10000);
        const expectApiResult = {
            report: {
                number_of_eggs: 5,
                sequence: '1 2 3 8 7 3',
                rotation_amount: 0.25,
                rotations: [
                    { egg: 1, was_rotated: 0.25 },
                    { egg: 2, was_rotated: 0.25 },
                    { egg: 3, was_rotated: 0.5 },
                    { egg: 4, was_rotated: 0 },
                    { egg: 5, was_rotated: 0 },
                ],
            },
        } as ApiResult;
        const mockCallback = (_, apiResult: any) => {
            expect(apiResult.body).to.equal(JSON.stringify(expectApiResult));
        };
        await incubatorController.portRun(undefined, undefined, mockCallback);
    });

    it('should not put setting if number_of_eggs is invalid', async function() {
        this.timeout(10000);
        const inputString = [
            '{"number_of_eggs":21,"sequence":"1 2 3 8 7 3","rotation_amount":0.25}',
            '{"number_of_eggs":-1,"sequence":"1 2 3 8 7 3","rotation_amount":0.25}',
            '{"number_of_eggs":1.5,"sequence":"1 2 3 8 7 3","rotation_amount":0.25}',
        ];

        inputString.map(async body => {
            const mockEvent = {
                ...mockEmptyEvent,
                body,
            };
            const expectErr = {
                error: {
                    code: errors.ERROR_CODE.InvalidEggNumber,
                    description: errors.ERROR_MESSAGE.InvalidEggNumber,
                },
            };
            const mockCallback = (_, apiResult: any) => {
                expect(apiResult.statusCode).to.equal(400);
                expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
            };
            await incubatorController.putSettings(mockEvent, undefined, mockCallback);
        });
    });

    it('should not put setting if sequence is invalid', async function() {
        this.timeout(10000);
        const inputString = [
            '{"number_of_eggs":5,"sequence":"1 a 3 8 7 3","rotation_amount":0.25}',
            '{"number_of_eggs":5,"sequence":"1 2.2 3 8 7 3","rotation_amount":0.25}',
            '{"number_of_eggs":5,"sequence":"1 *2 ~3 8 7 3","rotation_amount":0.25}',
        ];

        inputString.map(async body => {
            const mockEvent = {
                ...mockEmptyEvent,
                body,
            };
            const expectErr = {
                error: {
                    code: errors.ERROR_CODE.InvalidSequence,
                    description: errors.ERROR_MESSAGE.InvalidSequence,
                },
            };
            const mockCallback = (_, apiResult: any) => {
                expect(apiResult.statusCode).to.equal(400);
                expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
            };
            await incubatorController.putSettings(mockEvent, undefined, mockCallback);
        });
    });

    it('should not put setting if rotation_amount is invalid', async function() {
        this.timeout(10000);
        const inputString = [
            '{"number_of_eggs":5,"sequence":"1 2 3 8 7 3","rotation_amount":-1}',
            '{"number_of_eggs":5,"sequence":"1 2 3 8 7 3","rotation_amount":1.1}',
            '{"number_of_eggs":5,"sequence":"1 2 3 8 7 3","rotation_amount":"a"}',
        ];

        inputString.map(async body => {
            const mockEvent = {
                ...mockEmptyEvent,
                body,
            };
            const expectErr = {
                error: {
                    code: errors.ERROR_CODE.InvalidRotationAmount,
                    description: errors.ERROR_MESSAGE.InvalidRotationAmount,
                },
            };
            const mockCallback = (_, apiResult: any) => {
                expect(apiResult.statusCode).to.equal(400);
                expect(apiResult.body).to.deep.equal(JSON.stringify(expectErr));
            };
            await incubatorController.putSettings(mockEvent, undefined, mockCallback);
        });
    });
});
