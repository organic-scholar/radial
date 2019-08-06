export function length(min:number, max:number)
{
    return function(val, key)
    {
        if(val.length < min){
            return 'length';
        }
        if(val.length > max ){
            return 'length';
        }
    }
}

export function email(){
    return function(val, key)
    {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(false === re.test(val))
        {
            return 'email';
        }
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