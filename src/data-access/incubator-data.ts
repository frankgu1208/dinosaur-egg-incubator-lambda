import { DataAccess } from './utils-data-access';
import { Incubator } from 'interfaces/models';
import * as config from 'constant/config';

export class IncubatorData extends DataAccess<Incubator> {
    public static readonly ENV_VAR_CATALOG_TABLE_NAME = 'INCUBATOR_TABLE_NAME';

    constructor(tableName: string = process.env[IncubatorData.ENV_VAR_CATALOG_TABLE_NAME]) {
        super(tableName);
    }

    public getIncubator(
        incubatorId: string = config.DEFAULT_INCUBATOR_ID,
    ): Promise<Incubator> {
        return this.get({ incubatorId });
    }

    public putIncubator(
        incubator: Incubator,
        incubatorId: string = config.DEFAULT_INCUBATOR_ID,
    ): Promise<Incubator> {
        return this.put({
            incubatorId,
            ...incubator,
        });
    }

    public updateIncubator(
        incubator: Incubator,
        incubatorId: string = config.DEFAULT_INCUBATOR_ID,
    ): Promise<Incubator> {
        return this.update(incubator, { incubatorId });
    }
}
