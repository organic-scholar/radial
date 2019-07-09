import { FnServer } from './base';
import {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';
import { MissingRequestParamException } from './Exceptions';


export class FnLambdaServer<T> extends FnServer<T>
{

    async handle(event:APIGatewayEvent, context:T):Promise<APIGatewayProxyResult>
    {
        let body = JSON.parse(event.body || '{}');
        let fn = body.fn || null;
        try
        {
            if(fn === null) throw new MissingRequestParamException('fn');
            let result  = await (Array.isArray(fn) ? this.callServices(fn, context) : this.callService(fn, context));
            return {
                statusCode: 200,
                body: JSON.stringify({data: result})
            }
        }
        catch(error)
        {
            let formatted = this.formatter.format(error);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    error: formatted
                })
            }
        }
    }
}