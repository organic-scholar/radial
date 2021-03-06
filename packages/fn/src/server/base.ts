import * as Ajv from 'ajv';
import { ExceptionFormatter } from './ExceptionFormatter';
import { MissingRequestParamException, ServiceNotFoundException, InvalidParametersException, InvalidReturnTypeException } from './Exceptions';
import {JSONSchema6} from 'json-schema';
import { ISrvRequestParam, IResponseResult, IMetadata } from '../common/interfaces';


export abstract class Service<T>
{
    static serviceName: string;

    static args:string[];

    static paramSchema:JSONSchema6;

    static returnSchema:JSONSchema6;

    public abstract invoke(arg:any, context:T):Promise<any>
}


export class GetMetadata<T> extends Service<T>
{
    static serviceName = 'GetMetadata';

    static paramSchema:JSONSchema6 = {"type":"object","properties":{"param":{"type":"null"}},"required":["param"]};

    static returnSchema:JSONSchema6 = {"type":"object", "properties":{}, additionalProperties: true ,"required": ["return"]}

    constructor(protected metadata:IMetadata)
    {
        super();
    }
    public async invoke(arg: null, context: T): Promise<object>
    {
        return this.metadata;
    }
}


export class FnServer<T>
{
    services:{[key:string]: any} = {};

    formatter = new ExceptionFormatter();

    ajv = new Ajv();

    constructor(protected schema:JSONSchema6, protected metadata:IMetadata)
    {
        this.add(new GetMetadata<T>(metadata));
    }
    add(service:Service<T>)
    {
        this.services[service.constructor['serviceName']] = service;
        return this;
    }
    callServices(args:ISrvRequestParam[], context:T):Promise<IResponseResult[]>
    {
        let promises = args.map((arg)=>
        {
            return this.callService(arg, context).catch((err) =>
            {
                let formatted = this.formatter.format(err);
                return { error: formatted };
            });
        });
        return Promise.all(promises);
    }
    async callService(arg:ISrvRequestParam, context:T):Promise<IResponseResult>
    {
        if (arg.service == null) throw new MissingRequestParamException('service');
        let service = this.services[arg.service] || null;
        if (service == null) throw new ServiceNotFoundException(arg.service);
        this.validateParams(service.constructor, {param: arg.param || null});
        let result = await service.invoke.apply(service, [arg.param, context]);
        this.validateReturn(service.constructor, result);
        return result;
    }
    validateParams(Service:any, params:any)
    {
        let validate = this.ajv.compile(Object.assign({}, this.schema, Service.paramSchema));
        validate(params);
        if(validate.errors == null) return;
        let message = validate.errors.map((error)=>
        {
            return this.getErrorMessage(error, '');
        }).join(', ');
        throw new InvalidParametersException(message)
    }
    validateReturn(Service:any, value:any)
    {
        let validate = this.ajv.compile(Object.assign({}, this.schema, Service.returnSchema));
        validate({'return': value});
        if(validate.errors == null) return;
        let message = validate.errors.map((error)=>
        {
            return this.getErrorMessage(error, '');
        }).join(', ');
        throw new InvalidReturnTypeException(message);
    }
    getErrorMessage(error:Ajv.ErrorObject, prefix:string)
    {
        let message:string = error.message || '';
        if(error.keyword === 'required')
        {
            message = [prefix + error.dataPath + '.' + error.params['missingProperty'], 'is required' ].join(' ');
        }
        if(error.keyword === 'type')
        {
            message = prefix + error.dataPath + ' ' + error.message;
        }
        return message.startsWith('.') ? message.substr(1) : message;
    }
}