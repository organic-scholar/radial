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
        let def = propType.split('|').map((t)=>
        {
            let array = t.endsWith('[]') ? true : false;
            t = t.replace('[]', '').trim();
            this.typeExists(t, types)
            t = tsTypesAlias[t] || t;
            return {name: t, array: array};
        });
        return {
            name: name.endsWith('?') ? name.slice(0,-1) :  name,
            optional: name.endsWith('?'),
            types: def
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
            let def = prop.types.map((type)=>
            {
                let t = schemaTypeAlias[type.name] || type.name;
                let isSchemaType = jsonSchemaTypes.indexOf(t) == -1;
                let schema = isSchemaType ? { $ref: `#/definitions/${t}` } : {type: t}
                if(t.array) return {type: 'array', items: schema};
                return schema;

            });
            if(def.length == 1) schema.properties[prop.name] = def[0];
            else schema.properties[prop.name] = {oneOf: def};
            if(prop.optional == false) schema.required.push(prop.name);
        });
        return schema;
    }
}