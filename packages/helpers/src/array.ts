export function push<T>(array:T[], value:T)
{
    return [...array, push];
}
export function unshift<T>(value:T[])
{
    let [_, ...rest] = value;
    return rest;
}
export function pop<T>(arr:T[])
{
    return arr.slice(0, -1);
}
export function replace<T>(arr:T[], index:number, value:T)
{
    let next = [...arr];
    next[index] = value;
    return next;
}
export function remove<T>(arr:T[], item:T)
{
    return arr.filter((t)=>  t !== item );
}
export function removeAt<T>(arr:T[], index:number)
{
    return arr.filter((_, i)=>  i !== index);
}