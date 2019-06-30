import { Request, Response, NextFunction } from 'express';
import { MissingRequestParamException } from './Exceptions';
import { JSONSchema6 } from 'json-schema';


export function handler(schema:JSONSchema6, services:any[])
{


    // return (req: Request, res: Response, next: NextFunction) =>
    // {
    //     let fn = req.body.fn || null;
    //     try {
    //         if (fn === null) throw new MissingRequestParamException('fn');
    //         let result = await(Array.isArray(fn) ? this.callServices(fn) : this.callService(fn));
    //         res.status(200).json({ data: result });
    //     }
    //     catch (error) {
    //         console.log(error);
    //         let formatted = this.formatter.format(error);
    //         res.status(200).json({ error: formatted });
    //     }
    // }


}

