export function length(min:number, max:number)
{
    return function(val:string, key:string)
    {
        if(val.length < min) return 'minLength';
        if(val.length > max ) return 'maxLength';
    }
}

let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function email()
{
    return function(val:string, key:string)
    {
        if(false === regexp.test(val)) return 'email';
    }
}

export function containsIn(values:Array<any>)
{
    return function (val, key){
        if(values.indexOf(val) === -1)
        {
            return 'contains';
        }
    }
}

export function alpha(spaces:boolean = false)
{
    let regexp = spaces === false ? /^[a-z]+$/i : /^[a-z\s]+$/i;
    return function(val, key)
    {
        if(val.match(regexp)) return;
        return 'alpha';
    };
}
export function alphaNumeric(spaces:boolean = false)
{
    let regexp =  spaces === false ? /^[0-9a-z]+$/i : /^[0-9a-z\s]+$/i;
    return function(val, key)
    {
        if(val.match(regexp)) return;
        return 'alphaNumeric';
    };
}