import { expect } from 'chai';
import { IncubatorRepo } from '../src/repository/incubator-repo';
import { IncubatorData } from '../src/data-access/incubator-data';
import { Incubator } from '../src/interfaces/models';
import * as config from '../src/constant/config';

let incubatorRepo: IncubatorRepo;

describe('incubator-repo', () => {
    before(() => {
        const incubatorData = new IncubatorData('dinosaur-egg-incubator');
        incubatorRepo = new IncubatorRepo(incubatorData);
    });

    it('should able to create an incubator', async function() {
        this.timeout(10000);
        const result = await incubatorRepo.createIncubator(1, [1, 1, 2, 3], 0.05);
        const expectResult = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence: [1, 1, 2, 3],
            rotation: 0.05,
            eggs: [
                { id: 1, rotated: 0 },
            ],
            times: 0,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to create a incubator without egg', async function() {
        this.timeout(10000);
        const result = await incubatorRepo.createIncubator(0, [1, 1, 2, 3], 0.25);
        const expectResult = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence: [1, 1, 2, 3],
            rotation: 0.25,
            eggs: [],
            times: 0,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to rotate eggs', async function() {
        this.timeout(10000);
        await incubatorRepo.createIncubator(5, [1, 1, 2, 3], 0.25);
        const result = await incubatorRepo.rotateEggs();
        const expectResult = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence: [1, 1, 2, 3],
            rotation: 0.25,
            eggs: [
                { id: 1, rotated: 0.5 },
                { id: 2, rotated: 0.25 },
                { id: 3, rotated: 0.25 },
                { id: 4, rotated: 0 },
                { id: 5, rotated: 0 },
            ],
            times: 1,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to skip non exist egg', async function() {
        this.timeout(10000);
        await incubatorRepo.createIncubator(5, [6, 7, 8], 0.25);
        const result = await incubatorRepo.rotateEggs();
        const expectResult = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence: [6, 7, 8],
            rotation: 0.25,
            eggs: [
                { id: 1, rotated: 0 },
                { id: 2, rotated: 0 },
                { id: 3, rotated: 0 },
                { id: 4, rotated: 0 },
                { id: 5, rotated: 0 },
            ],
            times: 1,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('the device can rotate an egg at most one full rotation', async function() {
        this.timeout(10000);
        await incubatorRepo.createIncubator(1, [1, 1], 0.6);
        const result = await incubatorRepo.rotateEggs();
        const expectResult = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence: [1, 1],
            rotation: 0.6,
            eggs: [
                { id: 1, rotated: 1 },
            ],
            times: 1,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should not run the device more than once', async function() {
        this.timeout(10000);
        await incubatorRepo.createIncubator(1, [1], 0.3);
        await incubatorRepo.rotateEggs();
        const result = await incubatorRepo.rotateEggs();
        const expectResult = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence: [1],
            rotation: 0.3,
            eggs: [
                { id: 1, rotated: 0.3 },
            ],
            times: config.MAX_ROTATION_AMOUNT,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });
});
