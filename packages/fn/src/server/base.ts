import * as Ajv from 'ajv';
import { ExceptionFormatter } from './ExceptionFormatter';
import { MissingRequestParamException, ServiceNotFoundException, InvalidParametersException, InvalidReturnTypeException } from './Exceptions';
import {JSONSchema6} from 'json-schema';
import { ISrvRequestParam, IResponseResult } from '../common/interfaces';

export abstract class Service
{
    static serviceName: string;

    static args:string[];

    static argsSchema:JSONSchema6;

    static returnSchema:JSONSchema6;

    public abstract invoke(...args):Promise<any>
}


export class FnServer
{
    services:{[key:string]: any} = {};

    formatter = new ExceptionFormatter();

    ajv = new Ajv();

    constructor(protected schema:JSONSchema6)
    {

    }
    add(service:Service)
    {
        this.services[service.constructor['serviceName']] = service;
        return this;
    }
    callServices(args:ISrvRequestParam[]):Promise<IResponseResult[]>
    {
        let promises = args.map((arg)=>
        {
            return this.callService(arg).catch((err) =>
            {
                let formatted = this.formatter.format(err);
                return { error: formatted };
            });
        });
        return Promise.all(promises);
    }
    async callService(arg:ISrvRequestParam):Promise<IResponseResult>
    {
        if (arg.service == null) throw new MissingRequestParamException('service');
        if (arg.params == null) throw new MissingRequestParamException('params');
        let service = this.services[arg.service] || null;
        if (service == null) throw new ServiceNotFoundException(arg.service);
        this.validateParams(service.constructor, arg.params);
        let args = service.constructor.args.map((name:string)=>
        {
            return arg.params[name];
        })
        let result = await service.invoke.apply(service, args);
        this.validateReturn(service.constructor, result);
        return result;
    }
    validateParams(Service:any, params:any)
    {
        let validate = this.ajv.compile(Object.assign({}, this.schema, Service.argsSchema));
        validate(params);
        if(validate.errors == null) return;
        let message = validate.errors.map((error)=>
        {
            return this.getErrorMessage(error, 'params');
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