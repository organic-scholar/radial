import { JSONSchema6 } from 'json-schema';

export interface IMetadata
{
    Types: {
        [key: string]: {
            [key: string]: string
        }
    }
    Services: {
        [key: string]: {
            return: string
            param?: string
        }
    }

}

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
    types:{name:string, array:boolean}[];
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
    param:IPropDef
    paramSchema: JSONSchema6;
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