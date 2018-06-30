export * from './parse';
export {setIn} from './setIn';


export function isBlank(val)
{
    if(val === null || val === undefined) return true;
    if(isNaN(val)) return true;
    if(typeof val === 'string' && val.length === 0) return true;
    if(Array.isArray(val) && val.length === 0) return true;
    return false;
}
export function isNil(val)
{
    return val === null || val === undefined || val === NaN;
}
export function getIn(obj, path){
    let p = path.split('.');
    for (let i=0; i < p.length; i++){
        obj = obj[p[i]];
    }
    return obj;
}

export function pick(keys, object){
    let o = {};
    keys.forEach((key)=>{
        let value = getIn(object, key);
        setInMutable(o, key, value);
    });
    return o;
}
export function clone(object){
    if(Array.isArray(object)){
        return object.slice();
    }
    let proto = Object.getPrototypeOf(object);
    return Object.assign(Object.create(proto), object);
}

export function setInMutable(obj, path, value) {
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

export function interpolate(str, o) {
    return str.replace(
        /{([^{}]*)}/g,
        function (a, b) {
            let r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
}


