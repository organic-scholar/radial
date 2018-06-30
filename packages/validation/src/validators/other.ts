export function callback(cb:Function)
{
    return function(val, key:string){
        return cb(val, cb);
    }
}
export function typeOf(string)
{
    return function(val, key)
    {
        if(typeof val === string) return null;
        return 'invalid type';
    }
}
export function instanceOf(Type)
{
    return function(val, key)
    {
        if(val instanceof Type) return null;
        return 'invalid type';
    }

}