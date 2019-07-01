import { ISrvDefinition, IPropDef } from './DefParser';

export let template = (data:ISrvDefinition, type:string)=>
{
    let t = type === 'server' ? `export let schema = ${JSON.stringify(data.schema)}` : '';


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

    static args = ${JSON.stringify(service.args.map((arg)=> arg.name))}

    static argsSchema = ${JSON.stringify(service.argsSchema)};

    static returnSchema = ${JSON.stringify(service.returnSchema)}

    public abstract invoke(${renderFuncArgs(service.args)}):${renderReturnType(service.return)};
}
        `;
    }).join('');

    let t3 = data.services.map((service)=>
    {
        return `
export class ${service.name}
{
    static serviceName = '${service.name}';

    static args = ${JSON.stringify(service.args.map((arg)=> arg.name))}

    constructor(public config:IRequestConfig|Transaction)
    {

    }
    public invoke(${renderFuncArgs(service.args)}):${renderReturnType(service.return)}
    {
        return callService(this, arguments);
    }
}
`;
    }).join('');
    t3  = ["import {IRequestConfig, Transaction, callService} from '@radial/fn/lib/client'", t3].join('\n');


    return [t, t1, type === 'server' ? t2 : t3].join('');
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


