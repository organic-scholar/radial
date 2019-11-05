export function equalTo(opt:any)
{
    return function(val:any)
    {
        if(val != opt)
        {
            return 'equalTo';
        }
    }
}
export function identicalTo(opt:any)
{
    return function(val:any)
    {
        if(val !== opt)
        {
            return 'identicalTo';
        }
    }
}

