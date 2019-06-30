import { IRequestConfig } from '../src/client/Request';
import { Transaction } from '../src/client/Transaction';
import { callService } from '../src/client';

export let schema = {"definitions":{"string":{"type":"string"},"boolean":{"type":"boolean"},"number":{"type":"integer"},"User":{"type":"object","properties":{"username":{"$ref":"#/definitions/string"},"contact":{"$ref":"#/definitions/Contact"}},"required":["username","contact"]},"Contact":{"type":"object","properties":{"method":{"$ref":"#/definitions/string"}},"required":["method"]}}}
export interface User
{
    username:string
contact:Contact
}

export interface Contact
{
    method:string
}

export class GetUser
{
    static serviceName = 'GetUser';

    static args = ["id"]

    constructor(public config:IRequestConfig|Transaction)
    {

    }
    public invoke(id :string):Promise<User>
    {
        return callService<User>(this, arguments);
    }
}
