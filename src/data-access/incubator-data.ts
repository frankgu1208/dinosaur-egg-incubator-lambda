import { DataAccess } from './utils-data-access';
import { Incubator } from '../interfaces/models';
import * as config from '../constant/config';

export class IncubatorData extends DataAccess<Incubator> {
    public static readonly ENV_INCUBATOR_TABLE_NAME = 'INCUBATOR_TABLE_NAME';

    /**
     * @constructor for IncubatorData
     * @param tableName read from environment variable
     */
    constructor(tableName: string = process.env[IncubatorData.ENV_INCUBATOR_TABLE_NAME]) {
        super(tableName);
    }

    /**
     * get the existing incubator
     * @param incubatorId the id is constant because it only have one incubator
     */
    public getIncubator(
        incubatorId: string = config.DEFAULT_INCUBATOR_ID,
    ): Promise<Incubator> {
        return this.get({ incubatorId });
    }

    /**
     * create new or override existing incubator in the table
     * @param incubator new incubator to save to db
     * @param incubatorId the id is constant because it only have one incubator
     */
    public putIncubator(
        incubator: Incubator,
        incubatorId: string = config.DEFAULT_INCUBATOR_ID,
    ): Promise<Incubator> {
        return this.put({
            incubatorId,
            ...incubator,
        });
    }

    /**
     * update an existing incubator in the table
     * this will create a new object if the record not exists
     * @param incubator updated incubator to save to db
     * @param incubatorId the id is constant because it only have one incubator
     */
    public updateIncubator(
        incubator: Incubator,
        incubatorId: string = config.DEFAULT_INCUBATOR_ID,
    ): Promise<Incubator> {
        return this.update(incubator, { incubatorId });
    }
}
