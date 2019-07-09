import { JSONSchema6 } from 'json-schema';

export interface ISrvRequestParam
{
    service:string;
    param:object;
}
export interface IResponseResult<T={}>
{
    data?:T;
    error?:IResponseError
}

export interface IResponseError
{
    message:string;
    type:string;
    data?:object;
}

export interface ISrvDescriptor
{
    Types: {
        [key:string]: { [key: string]: string }
    }
    Services: {
        [key: string]: {
            'args': {[key:string]: string}
            'return': string
            'return?': string
        }
    }

}
export interface IPropDef
{
    name:string;
    type:string;
    array:boolean;
    optional: boolean;
}
export interface ITypeDef {
    name:string;
    props:IPropDef[]
    schema: JSONSchema6;
}
export interface IServiceDef
{
    name: string,
    arg:IPropDef
    argSchema: JSONSchema6;
    return: IPropDef,
    returnSchema: JSONSchema6;
}
export interface ISrvDefinition
{
    types: ITypeDef[];
    services: IServiceDef[];
    schema:JSONSchema6;
    descriptor:ISrvDescriptor;
}