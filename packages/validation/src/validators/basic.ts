export function isBlank(val)
{
    if(val === null || val === undefined) return true;
    if(typeof val === 'string' && val.length === 0) return true;
    if(Array.isArray(val) && val.length === 0) return true;
    return false;
}

export function notBlank()
{
    let func = function(val, key:string)
    {
        if(isBlank(val))
        {
            return 'notBlank'
        }
    }
    func['nullable'] = true;
    return func;
}

export function notNull()
{
    let func = function(val, key:string)
    {
        if(val === null)
        {
            return 'notNull';
        }
    }
    func['nullable'] = true;
    return func;
}

