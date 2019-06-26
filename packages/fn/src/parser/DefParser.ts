import { checkPropTypes } from 'prop-types';

let typesAlias:{[key:string]:string} = {
    'String': 'string',
    'Int': 'number',
    'Boolean': 'boolean'
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
    schema: any;
}
export interface IServiceDef
{
    name: string,
    return: IPropDef,
    args:IPropDef[]
    argsSchema: any;
}
export interface ISrvDefinition
{
    types: ITypeDef[];
    services: IServiceDef[];
    schema:any;
}

export class DefParser
{
    invoke(content:any)
    {
        let typeNames = Object.keys(content.Types);
        let types = this.parseTypes(content.Types);
        let services = this.parseServices(content.Services, typeNames);
        let schema = this.generateDefinitionsSchema(types);
        let srvDefinition:ISrvDefinition = {
            types, services, schema, 
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
                props: [],
                schema: {}
            };
            let typeOpts = types[type];
            let propDefs = Object.keys(typeOpts).map((name)=>
            {
                return this.parseProp(typeOpts[name], name, typeNames);
            });
            typeDef.props = propDefs;
            typeDef.schema = this.generateSchema(propDefs);
            return typeDef;
        })
    }
    parseServices(services:any, types:string[]) : IServiceDef[]
    {
        return Object.keys(services).map((srvName)=>
        {
            let srvOpts = services[srvName];
            let returnType = srvOpts['return'] || srvOpts['return?'] ||  null;
            if(returnType === null) throw new Error(`service ${srvName} return type if not defined`);
            let name = srvOpts['return'] ? 'return' : 'return?'
            let returnTypeDef = returnType = this.parseProp(returnType, name, types);
            let argDefs = Object.keys(srvOpts.args || {}).map((arg)=>
            {
                return this.parseProp(srvOpts.args[arg], arg, types);
            })
            let srvDef:IServiceDef = {
                name: srvName,
                args: argDefs,
                argsSchema: this.generateSchema(argDefs),
                return: returnTypeDef
            };
            return srvDef;
        })

    }
    parseProp(propType:any, name:string, types:string[]):IPropDef
    {
        let array = false;
        if (Array.isArray(propType))
        {
            propType = propType[0];
            array = true;
        }
        this.typeExists(propType, types);
        propType = typesAlias[propType] || propType;
        return {
            name: name.endsWith('?') ? name.slice(0,-1) :  name,
            optional: name.endsWith('?'),
            type: propType,
            array: array
        };
    }
    typeExists(typeName:string, types:string[])
    {
        if (types.indexOf(typeName) === -1 && Object.keys(typesAlias).indexOf(typeName) === -1)
        {
            throw new Error(`type ${typeName} is not defined`);
        }
    }
    generateDefinitionsSchema(types:ITypeDef[])
    {
        let schema = {
            definitions: {
                'string': {type: 'string'},
                'boolean': {type: 'boolean'},
                'number': {type: 'integer'}
            }
        };
        types.forEach((type)=>
        {
            schema.definitions[type.name] = type.schema;
        });
        return schema;
    }
    generateSchema(props:IPropDef[])
    {
        let schema:any = {
            type: "object",
            properties: {},
            required: []
        };
        props.forEach((prop)=>
        {
            if(prop.array)
            {
                let property = {
                    type: 'array',
                    items: {
                        $ref: `#/definitions/${prop.type}`
                    }
                }
                schema.properties[prop.name] = property;
            }
            else
            {
                let property = {
                    $ref: `#/definitions/${prop.type}`
                }
                schema.properties[prop.name] = property;
            }
            if(prop.optional == false) schema.required.push(prop.name);
        });
        return schema;
    }
}