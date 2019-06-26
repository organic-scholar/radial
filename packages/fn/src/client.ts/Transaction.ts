import { IRequestParam } from './Request';

interface ITransactionQueueItem {
    param: IRequestParam;
    deferred: Promise<object>;
}

export class Transaction
{
    queue:ITransactionQueueItem[] = []

    add(param:IRequestParam, p :Promise<any>)
    {
        let deferred = new Deferred();
        return deferred.promise;
    }
    run()
    {

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