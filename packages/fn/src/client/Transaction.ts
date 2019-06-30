import { IRequestConfig, BatchServiceRequest } from './Request';
import { ISrvRequestParam } from '../common/interfaces';

interface ITransactionQueueItem
{
    param: ISrvRequestParam;
    deferred: Deferred<object>;
}


export class Transaction
{
    protected queue:ITransactionQueueItem[] = []

    constructor(public config:IRequestConfig)
    {

    }
    add(param:ISrvRequestParam, deferred :Deferred<any>):void
    {
        this.queue.push({
            param, deferred
        });
    }
    run()
    {
        let params = this.queue.map((item)=>
        {
            return item.param;
        });
        return new BatchServiceRequest().invoke(params, this.config).then((results)=>
        {
            results.forEach((result, index)=>
            {
                if(result.data) this.queue[index].deferred.resolve(result)
                else if(result.error) this.queue[index].deferred.reject(result.error)
            });
        });
    }
}


export class Deferred<T>
{
	public promise: Promise<T>;
	public resolve!: Function;
	public reject!: Function;

    constructor()
    {
        this.promise = new Promise<T>((resolve, reject)=>
        {
            this.resolve  = resolve;
            this.reject = reject;
        });
	}

}