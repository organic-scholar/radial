import { IRequestConfig, ServiceRequest } from './Request';
import { Transaction, Deferred } from './Transaction';
export  { Transaction } from './Transaction';
export {IRequestConfig} from './Request';


abstract class Service
{

    static args:string[];

    constructor(public config:IRequestConfig|Transaction)
    {

    }
    public abstract invoke(...args):Promise<object>
}


export function callService<T>(instance:Service, param:object)
{
    let params: any = {};
    let service = instance.constructor['serviceName'];
    if (instance.config instanceof Transaction)
    {
        let defer = new Deferred<T>();
        instance.config.add({ param, service }, defer);
        return defer.promise;

    } return new ServiceRequest().invoke<T>({ service, param }, instance.config);
}