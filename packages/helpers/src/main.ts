export function isBlank(val:any)
{
    if(val === null || val === undefined || val === NaN) return true;
    if(typeof val === 'string' && val.length === 0) return true;
    if(Array.isArray(val) && val.length === 0) return true;
    return false;
}
export function isNil(val:any)
{
    return val === null || val === undefined || val === NaN;
}
export function getIn(obj:object, path:string)
{
    let p = path.split('.');
    for (let i=0; i < p.length; i++){
        obj = obj[p[i]];
    }
    return obj;
}

export function pick(keys:string[], object:object)
{
    let o = {};
    keys.forEach((key)=>
    {
        let value = getIn(object, key);
        o[key] = value;
    });
    return o;
}
export function clone(value:any)
{
    return JSON.parse(JSON.stringify(value));
}

export function setIn(obj:object, path:string, value:string)
{
    let current = obj;
    let stack = path.split('.');

    while ( stack.length > 1 ) {
        let i = stack.shift();
        if(current[i] == undefined){
            current[i] = {};
        }
        current = current[i];
    }
    current[stack.shift()] = value;
    return obj;
}

export function interpolate(str:string, o:object)
{
    return str.replace( /{([^{}]*)}/g, function (a, b)
    {
        let r = o[b];
        return (typeof r === 'string' || typeof r === 'number' ? r : a).toString();
    });
}


