import { DynamoDB } from 'aws-sdk';
import * as config from '../constant/config';

/**
 * @abstract @class a general class for data mapping and access to dynamoDb
 */
export abstract class DataAccess<T> {
    public static readonly isOffline: boolean = process.env.IS_OFFLINE != null
        && process.env.IS_OFFLINE !== 'false';
    public static readonly defaultAwsRegion: string = process.env.DEFAULT_AWS_REGION
        || config.AWS_REGION_SYDNEY;
    public static isDynamoDbLocal: boolean = DataAccess.isOffline;
    protected dc: DynamoDB.DocumentClient;

    /**
     * @constructor
     * @param tableName table name for this type of data
     * @param region default region will be ap-southeast-2
     * @param allowLocal for local unit test
     */
    constructor(
        protected tableName: string,
        region: string = DataAccess.defaultAwsRegion,
        allowLocal: boolean = true,
    ) {
        this.dc = this.buildDocumentClient(region, allowLocal);
    }

    /**
     * build document client
     * @param region default region will be ap-southeast-2
     * @param allowLocal for local unit test
     */
    public buildDocumentClient(
        region: string = DataAccess.defaultAwsRegion,
        allowLocal = true,
    ): DynamoDB.DocumentClient {
        const options = {
            region,
            convertEmptyValues: true,
        };
        if (allowLocal && DataAccess.isDynamoDbLocal) {
            Object.assign(options, {
                endpoint: 'http://localhost:8000',
            });
        }
        return new DynamoDB.DocumentClient(options);
    }

    /**
     * Get the item in the table by the key
     * @param key object for partition key and sort key
     */
    protected get(key: object): Promise<T> {
        return this.dc.get({
            Key: key,
            TableName: this.tableName,
        }).promise()
            .then(result => result && result.Item as T);
    }

    /**
     * Put the item into the table
     * @param item new item
     */
    protected put(item: T): Promise<T> {
        return this.dc.put({
            Item: item,
            TableName: this.tableName,
        }).promise()
            .then(() => item)
            .catch(err => {
                console.log('Put with err', err);
                return undefined;
            });
    }

    /**
     * Update an existing item in the table
     * If the item is not existing, it will create a new one
     * @param item updated item
     * @param paramKey object for partition key and sort key
     */
    protected update(item: T, paramKey: object): Promise<T> {
        const fields = Object.keys(item).filter(key => (
            item[key] !== undefined && item[key] !== null
            && (paramKey[key] === undefined || paramKey[key] === null)));

        // [ '#type = :type' ]
        const updateFields = fields.map(key => `#${key} = :${key}`);
        const updateExpression = updateFields.length
            ? ('set ' + updateFields.join(', ')) : '';

        // { ':type' : Program }
        const attributeValues = fields.reduce((result, key) => {
            result[`:${key}`] = item[key];
            return result;
        }, {});

        // { '#type' : 'type' }
        const attributeNames = fields.reduce((result, key) => {
            result[`#${key}`] = key;
            return result;
        }, {});

        // tslint:disable: object-literal-sort-keys
        const params = {
            TableName: this.tableName,
            Key: paramKey,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: attributeValues,
            ExpressionAttributeNames: attributeNames,
            ReturnValues: 'ALL_NEW',
        } as DynamoDB.DocumentClient.UpdateItemInput;
        // tslint:enable

        return this.dc.update(params)
            .promise()
            .then(output => output.Attributes as T)
            .catch(err => {
                console.log('Update item with err',
                    { err, params, item });
                return undefined;
            });
    }
}
