import { APIGatewayEvent, Context, ProxyCallback, ProxyResult } from 'aws-lambda';
import { ErrorResult } from './errors';

export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = (event: APIGatewayEvent, context: Context, callback: ApiCallback) => any;
export type ApiResponse = ProxyResult;

export interface ErrorResponseBody {
    error: ErrorResult;
}
