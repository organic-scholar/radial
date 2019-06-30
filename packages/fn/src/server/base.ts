import * as Ajv from 'ajv';
import { ExceptionFormatter } from './ExceptionFormatter';
import { MissingRequestParamException, ServiceNotFoundException, InvalidParametersException, InvalidReturnTypeException } from './Exceptions';
import {Request, Response, NextFunction} from 'express';
import {JSONSchema6} from 'json-schema';
import { ISrvRequestParam, IResponseResult } from '../common/interfaces';


export class FnServer
{
    services:{[key:string]: any} = {};

    formatter = new ExceptionFormatter();

    ajv = new Ajv();

    constructor(protected schema:JSONSchema6)
    {

    }
    add(serviceType:any)
    {
        this.services[serviceType.serviceName] = serviceType;
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
        let Service = this.services[arg.service] || null;
        if (Service == null) throw new ServiceNotFoundException(name);
        this.validateParams(Service, arg.params);
        let args = Service.args.map((name:string)=>
        {
            return arg.params[name];
        })
        let service = new Service();
        let result = await service.invoke.apply(service, args);
        this.validateReturn(Service, result);
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