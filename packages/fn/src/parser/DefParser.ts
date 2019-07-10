import { ISrvDescriptor, ISrvDefinition, ITypeDef, IServiceDef, IPropDef } from '../common/interfaces';
import { JSONSchema6 } from 'json-schema';

let tsTypesAlias = {
    'integer': 'number',
}

let schemaTypeAlias = {
    'number': 'integer'
}

let jsonSchemaTypes = ['string', 'boolean', 'integer', 'null'];

export class DefParser
{
    invoke(descriptor:ISrvDescriptor)
    {
        let typeNames = Object.keys(descriptor.Types);
        let types = this.parseTypes(descriptor.Types);
        let services = this.parseServices(descriptor.Services, typeNames);
        let schema = this.generateDefinitionsSchema(types);
        let srvDefinition:ISrvDefinition = {
            types, services, schema, descriptor
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
            let returnName = srvOpts['return'] ? 'return' : 'return?'
            let returnTypeDef = returnType = this.parseProp(returnType, returnName, types);

            let paramType = srvOpts['param'] ||  'null';
            let paramTypeDef = this.parseProp(paramType, 'param', types);

            let srvDef:IServiceDef = {
                name: srvName,
                param: paramTypeDef,
                paramSchema: this.generateSchema([paramTypeDef]),
                return: returnTypeDef,
                returnSchema: this.generateSchema([returnTypeDef])
            };
            return srvDef;
        })

    }
    parseProp(propType:string, name:string, types:string[]):IPropDef
    {
        let array = false;
        if (propType.endsWith('[]'))
        {
            propType = propType.replace('[]', '');
            array = true;
        }
        this.typeExists(propType, types);
        propType = tsTypesAlias[propType] || propType;
        return {
            name: name.endsWith('?') ? name.slice(0,-1) :  name,
            optional: name.endsWith('?'),
            type: propType,
            array: array
        };
    }
    typeExists(typeName:string, types:string[])
    {
        if (types.indexOf(typeName) === -1 && jsonSchemaTypes.indexOf(typeName) === -1)
        {
            throw new Error(`type ${typeName} is not defined`);
        }
    }
    generateDefinitionsSchema(types:ITypeDef[])
    {
        let schema = {
            definitions: {}
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
            let type = schemaTypeAlias[prop.type] || prop.type;
            let isSchemaType = jsonSchemaTypes.indexOf(type) == -1;
            let def =   isSchemaType ? {$ref: `#/definitions/${type}`} : {type: type}
            if(prop.array)
            {
                schema.properties[prop.name] = {type: 'array', items: def};
            }
            else
            {
                schema.properties[prop.name] = def;
            }
            if(prop.optional == false) schema.required.push(prop.name);
        });
        return schema;
    }
}