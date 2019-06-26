
export abstract class GetUser
{
    static serviceName = 'GetUser';

    static args = ["id"]

    static argsSchema = {"type":"object","properties":{"id":{"$ref":"#/definitions/string"}},"required":["id"]};

    public invoke(id :string):Promise<any> | void
    {
        let args = arguments;
        let params:any = {};
        GetUser.args.forEach((name, index)=>
        {
            params[name] = args[index];
        });
        // return {service: GetUser.service, params: params}
    }
}
        