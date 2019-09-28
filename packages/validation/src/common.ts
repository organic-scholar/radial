export function setIn<T, V>(obj:T, path:string, value:V)
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
export function getIn(obj:object, path:string)
{
    let p = path.split('.');
    for (let i=0; i < p.length; i++)
    {
        obj = obj[p[i]];
    }
    return obj;
}