import { expect } from 'chai';
import { IncubatorData } from '../src/data-access/incubator-data';
import { Incubator } from '../src/interfaces/models';
import * as config from '../src/constant/config';

let incubatorData: IncubatorData;
const mockData1 = {
    sequence: [1],
    rotation: 0.25,
    eggs: [{ id: 1, rotated: 0 }],
    times: 0,
} as Incubator;
const mockData2 = {
    sequence: [1, 1, 2],
    rotation: 0.5,
    eggs: [
        { id: 1, rotated: 0 },
        { id: 2, rotated: 0 },
    ],
    times: 0,
} as Incubator;

describe('handler', () => {
    before(() => {
        incubatorData = new IncubatorData('dinosaur-egg-incubator');
    });

    it('should able to put incubator', async function() {
        this.timeout(10000);
        const result = await incubatorData.putIncubator(mockData1);
        const expectResult = {
            ...mockData1,
            incubatorId: config.DEFAULT_INCUBATOR_ID,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to get incubator', async function() {
        this.timeout(10000);
        const result = await incubatorData.getIncubator();
        const expectResult = {
            ...mockData1,
            incubatorId: config.DEFAULT_INCUBATOR_ID,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to update incubator', async function() {
        this.timeout(10000);
        const updateData = {
            sequence: [1],
            rotation: 0.25,
            eggs: [{
                id: 1,
                rotated: 0.25,
            }],
            times: 0,
        } as Incubator;
        const result = await incubatorData.updateIncubator(updateData);
        const expectResult = {
            ...updateData,
            incubatorId: config.DEFAULT_INCUBATOR_ID,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to put a new incubator', async function() {
        this.timeout(10000);
        const result = await incubatorData.putIncubator(mockData2);
        const expectResult = {
            ...mockData2,
            incubatorId: config.DEFAULT_INCUBATOR_ID,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });

    it('should able to get the new incubator', async function() {
        this.timeout(10000);
        const result = await incubatorData.getIncubator();
        const expectResult = {
            ...mockData2,
            incubatorId: config.DEFAULT_INCUBATOR_ID,
        } as Incubator;
        expect(result).to.deep.equal(expectResult);
    });
});
