import { Transaction, Deferred } from './Transaction';


export abstract class GetUser
{
    static serviceName = 'GetUser';

    static args = ["id"]

    static argsSchema = {"type":"object","properties":{"id":{"$ref":"#/definitions/string"}},"required":["id"]};

    constructor(protected transaction?:Transaction)
    {

    }
    public invoke(id :string):Promise<any> | void
    {
        let args = arguments;
        let params:any = {};
        let service = GetUser.serviceName;
        GetUser.args.forEach((name, index)=>
        {
            params[name] = args[index];
        });
        if(this.transaction)
        {
            let deferred =  new Deferred();
            this.transaction.add({params: params, service: service}, deferred);
            return deferred.promise;
        }
        

    }
}
        