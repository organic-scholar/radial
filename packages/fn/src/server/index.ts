import { isArray } from 'util';
import { checkArgTypes } from './checkArgTypes';

export class FnServer
{
    services:{[key:string]: any} = {};

    register(serviceType)
    {
        this.services[serviceType.serviceName] = serviceType;
    }
    handle = (req, res, next)=>
    {
        let srv = req.query.srv || req.body.srv || '';
        req.query.params || req.body.params || '';
        if(srv === '') return res.status(400).json({message: 'parameter srv is missing'});
        let Service = this.services[srv] || null;
        if(Service === null) return res.status(400).json({message: 'unable to resolve service ' + srv})
        let args = this.getArgs(Service['args'], Service['defaultArgs'], req);
        if(!isArray(args)) return res.status(400).json({message: `parameter ${args} is missing`})
        let error = this.checkArgTypes(Service, args)
        let instance = new Service();
        instance.invoke.apply(instance, args).then((data)=>
        {
            res.status(200).json({data});
        })
        .catch((err)=>
        {
            res.status(err.status || 400).json({
                message: err.message,
                data: err.data || {}
            })
        })
        ;
    }
    getArgs(args:string[], defaultArgs={}, req)
    {
        let params:any[] = [];
        let query = req.query || {};
        let body = req.body || {};
        let files = req.files || {};
        for(let name of args)
        {
            let value = query[name] || body[name] || files[name] || defaultArgs[name] || null;
            if(value === null) return name; 
            params.push(value);
        }
        return params;
    }
    checkArgTypes(Service, argValues)
    {
        let args = {};
        Service.args.forEach((arg, index)=>
        {
            args[arg] = argValues[index];
        });
        return checkArgTypes(Service.argTypes, args, 'arg', Service.name);
    }
}