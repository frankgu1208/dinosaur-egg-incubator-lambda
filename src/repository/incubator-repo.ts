import { IncubatorData } from '../data-access/incubator-data';
import { Incubator, Egg } from '../interfaces/models';
import * as config from '../constant/config';

const incubatorData = new IncubatorData();

export class IncubatorRepo {
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
        const putResult = await incubatorData.putIncubator(incubator);
        return putResult;
    }

    public async rotateEggs(): Promise<Incubator> {
        const incubator = await incubatorData.getIncubator();
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
        return incubatorData.updateIncubator(incubator);
    }
}
