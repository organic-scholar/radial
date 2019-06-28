import * as Ajv from 'ajv';
import { ExceptionFormatter } from './ExceptionFormatter';
import { MissingRequestParamException, ServiceNotFoundException, InvalidParametersException, InvalidReturnTypeException } from './Exceptions';
import {Request, Response, NextFunction} from 'express';
import {JSONSchema6} from 'json-schema';


export class FnServer
{
    services:{[key:string]: any} = {};

    formatter = new ExceptionFormatter();

    ajv = new Ajv();

    constructor(protected schema:JSONSchema6)
    {
        this.handle = this.handle.bind(this);
    }
    add(serviceType:any)
    {
        this.services[serviceType.serviceName] = serviceType;
        return this;
    }
    async handle(req:Request, res:Response, next:NextFunction)
    {
        let fn = req.body.fn || null;
        try
        {
            if(fn === null) throw new MissingRequestParamException('fn');
            if(fn.service == null) throw new MissingRequestParamException('service');
            if(fn.params == null) throw new MissingRequestParamException('params');
            let Service = this.services[fn.service] || null;
            if (Service == null) throw new ServiceNotFoundException(name);
            let result = await this.callService(fn.service, fn.params);
            this.validateReturn(Service, result);
            res.status(200).json({data: result});
        }
        catch(error)
        {
            let formatted = this.formatter.format(error);
            res.status(200).json({error: formatted});
        }
    }
    callService(Service:any, params:any)
    {
        this.validateParams(Service, params);
        let args = Service.args.map((name:string)=>
        {
            return params[name];
        })
        let service = new Service();
        return service.invoke.apply(service, args);
    }
    validateParams(Service:any, params:any)
    {
        let validate = this.ajv.compile(Object.assign({}, this.schema, Service.argsSchema));
        validate(params);
        if(validate.errors == null) return;
        let message = validate.errors.map((error)=>
        {
            return ['param', error.dataPath, error.message].join(' ');
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
            return ['return', error.message].join(' ');
        }).join(', ');
        throw new InvalidReturnTypeException(message);
    }
}