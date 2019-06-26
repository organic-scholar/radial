export let schema = {"definitions":{"string":{"type":"string"},"boolean":{"type":"boolean"},"number":{"type":"integer"},"User":{"type":"object","properties":{"username":{"$ref":"#/definitions/string"},"contact":{"$ref":"#/definitions/Contact"}},"required":["username","contact"]},"Contact":{"type":"object","properties":{"method":{"$ref":"#/definitions/string"}},"required":["method"]}}}

interface User
{
    username:string
    contact:Contact
}

interface Contact
{
    method:string
}

export abstract class GetUser
{
    static serviceName = 'GetUser';

    static args = ["id"]

    static argsSchema = {"type":"object","properties":{"id":{"$ref":"#/definitions/string"}},"required":["id"]};

    public abstract invoke(id :string):Promise<User>;
}
        