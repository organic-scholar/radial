export let metadata = {"Types":{"Post":{"Title":"string","Body":"string"},"User":{"username":"string","password":"integer","contact":"Contact"},"Contact":{"method":"string","value":"string[]"}},"Services":{"GetPosts":{"return":"Post[]"},"GetUsers":{"return":"User[]"},"GetUser":{"param":"string","return":"User"}}};
export let schema = {"definitions":{"Post":{"type":"object","properties":{"Title":{"type":"string"},"Body":{"type":"string"}},"required":["Title","Body"]},"User":{"type":"object","properties":{"username":{"type":"string"},"password":{"type":"integer"},"contact":{"$ref":"#/definitions/Contact"}},"required":["username","password","contact"]},"Contact":{"type":"object","properties":{"method":{"type":"string"},"value":{"type":"array","items":{"type":"string"}}},"required":["method","value"]}}};
export interface Post
{
    Title:string
Body:string
}

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

export abstract class GetPosts<T>
{
    static serviceName = 'GetPosts';

    static paramSchema = {"type":"object","properties":{"param":{"type":"null"}},"required":["param"]};

    static returnSchema = {"type":"object","properties":{"return":{"type":"array","items":{"$ref":"#/definitions/Post"}}},"required":["return"]}

    public abstract invoke(param:null, context:T):Promise<Post[]>;
}
        
export abstract class GetUsers<T>
{
    static serviceName = 'GetUsers';

    static paramSchema = {"type":"object","properties":{"param":{"type":"null"}},"required":["param"]};

    static returnSchema = {"type":"object","properties":{"return":{"type":"array","items":{"$ref":"#/definitions/User"}}},"required":["return"]}

    public abstract invoke(param:null, context:T):Promise<User[]>;
}
        
export abstract class GetUser<T>
{
    static serviceName = 'GetUser';

    static paramSchema = {"type":"object","properties":{"param":{"type":"string"}},"required":["param"]};

    static returnSchema = {"type":"object","properties":{"return":{"$ref":"#/definitions/User"}},"required":["return"]}

    public abstract invoke(param:string, context:T):Promise<User>;
}
        