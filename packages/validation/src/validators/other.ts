export function callback(cb:Function)
{
    return function(val, key:string)
    {
        return cb(val, cb);
    }
}
export function typeOf(string:string)
{
    return function(val:any)
    {
        if(typeof val === string) return null;
        return 'typeOf';
    }
}
export function instanceOf(Type:any)
{
    return function(val:any)
    {
        if(val instanceof Type) return null;
        return 'instanceOf';
    }

}

export function isUUID()
{
    return function(val:string)
    {
        let regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        let matches = regexp.exec(val);
        if(matches) return;
        return 'isUUID';
    }
}