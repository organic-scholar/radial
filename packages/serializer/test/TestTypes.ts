import { type } from "../src/Serializer";

export class Policy
{
    @type(String)
    resource:string;

    @type([String])
    permissions:string[];
}

export class Role {

    @type(String)
    name:string;

    @type([Policy])
    policies:Policy[]
}
export class Contact
{
    @type(String)
    method:string;

    @type(String)
    value:string;
}

export class User
{
    @type(Number)
    id:number;

    @type(String)
    firstName:string;

    @type(String)
    lastName:string;

    @type([Role])
    roles:Role[];

    @type(Contact)
    contact:Contact
}
