import { IncubatorData } from '../data-access/incubator-data';
import { Incubator, Egg } from '../interfaces/models';
import * as config from '../constant/config';

export class IncubatorRepo {
    /**
     * @constructor for IncubatorRepo
     * @param incubatorData data mapping to dynamoDb
     */
    public constructor(
        public incubatorData: IncubatorData = new IncubatorData(),
    ) { }

    /**
     * This function will create a new incubator
     * @param amount eggs amount, should be integer
     * @param sequence sequence to rotate the eggs, array in integers
     * @param rotation rotation percentage, between 0 to 1
     */
    public async createIncubator(
        amount: number, sequence: number[], rotation: number,
    ): Promise<Incubator> {
        const eggs = Array.from(Array(amount)).map((_, index: number) => ({
            id: index + 1,
            rotated: 0,
        } as Egg));

        const incubator = {
            incubatorId: config.DEFAULT_INCUBATOR_ID,
            sequence,
            rotation,
            eggs,
            times: 0,
        } as Incubator;
        const putResult = await this.incubatorData.putIncubator(incubator);
        return putResult;
    }

    /**
     * To rotate the eggs already in the database,
     * If the incubator not exists, it will return undefined
     * If the incubator has already been rotated, it will return incubator directly
     */
    public async rotateEggs(): Promise<Incubator> {
        const incubator = await this.incubatorData.getIncubator();
        if (!incubator) {
            return undefined;
        }

        // Check if the incubator ran already
        if (config.MAX_RUN_TIMES && incubator.times >= config.MAX_RUN_TIMES) {
            return incubator;
        }

        incubator.sequence.map(seq => {
            const egg = incubator.eggs.find(e => e.id === seq);
            if (egg) {
                const rotated = egg.rotated + incubator.rotation;
                egg.rotated = rotated <= 1 ? rotated : 1;
            }
        });
        incubator.times++;
        return this.incubatorData.updateIncubator(incubator);
    }
}
