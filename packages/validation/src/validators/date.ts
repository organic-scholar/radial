export function isAfter(date:Date, key)
{
    return function(val:Date, _)
    {
        if(val instanceof Date && date instanceof Date)
        {
            if(val.getTime() > date.getTime()) return;
            return _ + ' must be after ' + key;
        }
    }
}
export function isBefore(date:Date, key)
{
    return function(val:Date, _)
    {
        if(val instanceof Date && date instanceof Date)
        {
            if(val.getTime() < date.getTime()) return;
            return _ + ' must be before ' + key;
        }
    }

}