import * as Ajv from 'ajv';
import { ExceptionFormatter } from './ExceptionFormatter';
import { MissingRequestParamException, ServiceNotFoundException, InvalidParametersException } from './Exceptions';
import {Request, Response, NextFunction} from 'express';


export class FnServer
{
    services:{[key:string]: any} = {};

    formatter = new ExceptionFormatter();

    ajv = new Ajv();

    constructor(definitons:any)
    {

    }
    register(serviceType)
    {
        this.services[serviceType.serviceName] = serviceType;
    }
    async handle(req:Request, res:Response, next:NextFunction)
    {
        let fn = req.body.fn || null;
        try
        {
            if(fn === null) throw new MissingRequestParamException('fn');
            if(fn.service == null) throw new MissingRequestParamException('service');
            if(fn.params == null) throw new MissingRequestParamException('params');
            let result = await this.callService(fn.service, fn.params);
            res.status(200).json({data: result});
        }
        catch(error)
        {
            let formatted = this.formatter.format(error);
            res.status(200).json({error: formatted});
        }
    }
    callService(name:string, params:any)
    {
        let Service = this.services[name] || null;
        if(Service == null) throw new ServiceNotFoundException(name);
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
        let validate = this.ajv.compile(Object.assign(Service.argsSchema, params));
        validate(params);
        if(validate.errors == null) return;
        let message = validate.errors.map((error)=>
        {
            return [error.dataPath, error.message].join(' ');
        }).join(', ');
        throw new InvalidParametersException(message)
    }
}