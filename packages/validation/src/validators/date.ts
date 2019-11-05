export function isAfter(date:Date)
{
    return function(val:string|number, _)
    {
        let value = new Date(val);
        if(value.getTime())
        {
            if(value.getTime() > date.getTime()) return;
            return 'isAfter'
        }
    }
}

export function isDate()
{
    return function(value:string)
    {
        let date = new Date(value);
        if(date.getTime()) return;
        return 'isTimestamp';
    }
}

export function isTimestamp()
{
    return function(unix:number)
    {
        let date = new Date(unix * 1000);
        if(date.getTime()) return;
        return 'isTimestamp';
    }
}

export function isBefore(date:Date)
{
    return function(val:string, _)
    {
        let value = new Date(val);
        if(value.getTime())
        {
            if(value.getTime() < date.getTime()) return;
            return 'isBefore';
        }
    }
}

export function isBetween(min:Date, max:Date)
{
    return function(val:string, _)
    {
        let value = new Date(val);
        if(value.getTime())
        {
            if(min.getTime() < value.getTime() &&  value.getTime() < max.getTime()) return;
            return 'isBetween';
        }
    }
}