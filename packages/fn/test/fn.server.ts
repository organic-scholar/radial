export let metadata = {"Types":{"User":{"username":"string","password":"integer","contact":"Contact"},"Contact":{"method":"string","value":"string[]"}},"Services":{"GetUsers":{"return":"User[]"},"GetUser":{"args":{"id":"string"},"return":"User"}}};
export let schema = {"definitions":{"User":{"type":"object","properties":{"username":{"type":"string"},"password":{"type":"integer"},"contact":{"$ref":"#/definitions/Contact"}},"required":["username","password","contact"]},"Contact":{"type":"object","properties":{"method":{"type":"string"},"value":{"type":"array","items":{"type":"string"}}},"required":["method","value"]}}};
export interface User
{
    username:string
password:number
contact:Contact
}

export interface Contact
{
    method:string
value:string[]
}

export abstract class GetUsers
{
    static serviceName = 'GetUsers';

    static args = []

    static argsSchema = {"type":"object","properties":{},"required":[]};

    static returnSchema = {"type":"object","properties":{"return":{"type":"array","items":{"$ref":"#/definitions/User"}}},"required":["return"]}

    public abstract invoke():Promise<User[]>;
}
        
export abstract class GetUser
{
    static serviceName = 'GetUser';

    static args = ["id"]

    static argsSchema = {"type":"object","properties":{"id":{"type":"string"}},"required":["id"]};

    static returnSchema = {"type":"object","properties":{"return":{"$ref":"#/definitions/User"}},"required":["return"]}

    public abstract invoke(id :string):Promise<User>;
}
        