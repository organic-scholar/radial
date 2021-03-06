import { ISrvDefinition, IPropDef } from '../common/interfaces';

export let template = (data:ISrvDefinition, type:string)=>
{
    let t0 = type === 'server' ? `export let metadata = ${JSON.stringify(data.descriptor)};` : '';

    let t = type === 'server' ? `
export let schema = ${JSON.stringify(data.schema)};` : '';

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
export abstract class ${service.name}<T>
{
    static serviceName = '${service.name}';

    static paramSchema = ${JSON.stringify(service.paramSchema)};

    static returnSchema = ${JSON.stringify(service.returnSchema)}

    public abstract invoke(${[renderProp(service.param), 'context:T'].join(', ')}):${renderReturnType(service.return)};
}
        `;
    }).join('');

    let t3 = data.services.map((service)=>
    {
        return `
export class ${service.name}
{
    static serviceName = '${service.name}';

    constructor(public config:IRequestConfig|Transaction)
    {

    }
    public invoke(${renderProp(service.param)}):${renderReturnType(service.return)}
    {
        return callService(this, param);
    }
}
`;
    }).join('');
    t3  = ["import {IRequestConfig, Transaction, callService} from '@radial/fn/lib/client'", t3].join('\n');


    return [t0, t, t1, type === 'server' ? t2 : t3].join('');
}

function renderType(type:{name:string, array:boolean}[])
{
    return type.map((t)=>
    {
        return `${t.name}${t.array ? '[]':''}`
    }).join(' | ');
}

function renderProp(def:IPropDef)
{
    return `${def.name}${def.optional ? '?' : ''}:${renderType(def.types)}`
}

function renderProps(defs:IPropDef[])
{
    return defs.map((def)=>
    {
        return renderProp(def);
    }).join('\n');
}

function renderReturnType(def:IPropDef):string
{
    return `Promise<${renderType(def.types)}${def.optional ? ' | void' : ''}>`
}


