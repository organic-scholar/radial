import { FnServer } from './base';
import {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';
import { MissingRequestParamException } from './Exceptions';


export class FnLambdaServer extends FnServer
{
    async handle(event:APIGatewayEvent):Promise<APIGatewayProxyResult>
    {
        let body = JSON.parse(event.body || '{}');
        let fn = body.fn || null;
        try
        {
            if(fn === null) throw new MissingRequestParamException('fn');
            let result  = await (Array.isArray(fn) ? this.callServices(fn) : this.callService(fn));
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