import { isArray } from 'util';

export class FnServer
{
    services:{[key:string]: any} = {};

    handle(req, res, next)
    {
        let srv = req.query.srv || req.body.srv || '';
        req.query.params || req.body.params || '';
        if(srv === '') return res.json.status(400).json({message: 'parameter srv is missing'});
        let Service = this.services[srv] || null;
        if(Service === null) return res.status(400).json({message: 'unable to resolve service ' + srv})
        let params = this.getParams(Service['args'], Service['defaultArgs'], req);
        if(!isArray(params)) return res.status(400).json({message: `missing ${params} is missing`})
        let instance = new Service();
        srv.invoke.apply(srv, params).then((result)=>
        {
            res.status(200).json({result});
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
    getParams(args:string[], defaultArgs={}, req)
    {
        let params:any[] = [];
        for(let name in args)
        {
            let value = req.query[name] || req.body[name] || req.files[name] || defaultArgs[name] || null;
            if(value === null) return name; 
            return params.push(value);
        }
        return params;
    }
}