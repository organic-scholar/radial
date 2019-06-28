import { ISrvDefinition, IPropDef } from './DefParser';

export let template = (data:ISrvDefinition)=>
{
    let t = `export let schema = ${JSON.stringify(data.schema)}`;


    let t1 = data.types.map((type) =>
    {
        return `
export interface ${type.name}
{
    ${renderProps(type.props)}
}
`;
    }).join('');

    let t2 = data.services.map((service)=>
    {
        return `
export abstract class ${service.name}
{
    static serviceName = '${service.name}';

    static args = ${JSON.stringify(Object.keys(service.argsSchema.properties))}

    static argsSchema = ${JSON.stringify(service.argsSchema)};

    static returnSchema = ${JSON.stringify(service.returnSchema)}

    public abstract invoke(${renderFuncArgs(service.args)}):${renderReturnType(service.return)};
}
        `;
    }).join('');
    return [t, t1, t2].join('');
}

function renderProps(defs:IPropDef[])
{
    return defs.map((def)=>
    {
        return `${def.name}${def.optional ? '?' : ''}:${def.type}${def.array ? '[]' : ''}`
    }).join('\n');
}

function renderFuncArgs(defs:IPropDef[]):string
{
    return defs.map((def)=>
    {
        return `${def.name} ${def.optional ? '?' : ''}:${def.type}${def.array ? '[]' : ''}`
    }).join(', ')
}

function renderReturnType(def:IPropDef):string
{
    return `Promise<${def.type}${def.array ? '[]': ''}${def.optional ? '| undefined' : ''}>`
}


