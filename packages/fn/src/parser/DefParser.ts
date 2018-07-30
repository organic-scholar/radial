import { isArray } from "util";

let typesAlias:{[key:string]:string} = {
    'String': 'string',
    'Int': 'number',
    'Boolean': 'boolean'
}
interface IPropDef
{
    name:string;
    type:string
}
interface ITypeDef {
    name:string;
    props:IPropDef[]
}
interface IServiceDef
{
    name: string,
    returnType: string,
    args:IPropDef[]
}
export interface ISrvDefinition
{
    types: ITypeDef[];
    services: IServiceDef[];
}

export class DefParser
{
    invoke(content:any)
    {
        let types = Object.keys(content.Types);
        let srvDefinition:ISrvDefinition = {
            types: this.parseTypes(content.Types),
            services: this.parseServices(content.Services, types)
        };
        return srvDefinition;
    }
    parseTypes(types:any)
    {
        let typeNames = Object.keys(types);
        return typeNames.map((type:string)=>
        {
            let typeDef:ITypeDef = {
                name: type,
                props: []
            };
            let typeOpts = types[type];
            let propDefs = Object.keys(typeOpts).map((name)=>
            {
                return this.parseProp(typeOpts[name], name, typeNames);
            });
            typeDef.props = propDefs;
            return typeDef;
        })
    }
    parseServices(services:any, types:string[]) : IServiceDef[]
    {
        return Object.keys(services).map((srvName)=>
        {
            let srvOpts = services[srvName];
            let returnType = srvOpts.return || '';
            if(returnType === '') throw new Error(`service ${srvName} return type if not defined`);
            let returnTypeDef = returnType = this.parseProp(returnType, 'return', types);
            let argDefs = Object.keys(srvOpts.args || {}).map((arg)=>
            {
                return this.parseProp(srvOpts.args[arg], arg, types);
            })
            let srvDef:IServiceDef = {
                name: srvName,
                args: argDefs,
                returnType: returnTypeDef.type
            };
            return srvDef;
        })

    }
    parseProp(propType:any, name:string, types:string[]):IPropDef
    {
        let array = false;
        if (isArray(propType))
        {
            propType = propType[0];
            array = true;
        }
        this.typeExists(propType, types);
        propType = typesAlias[propType] || propType;
        return {
            name: name,
            type: array ? `${propType}[]` : propType
        };
    }
    typeExists(typeName:string, types:string[])
    {
        if (types.indexOf(typeName) === -1 && Object.keys(typesAlias).indexOf(typeName) === -1)
        {
            throw new Error(`type ${typeName} is not defined`);
        }
    }
}