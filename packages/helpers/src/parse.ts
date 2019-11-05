export function parseJson<T>(json:string, def=null):T
{
    try {
        return JSON.parse(json);
    }
    catch {
        return def;
    }
}

export function parseBool(bool:string)
{
    if(bool.toLowerCase() === 'true')  return true;
    return false;
}

export function jsonString(object:any):string
{
    return JSON.stringify(object);
}

export function toFormData(obj, form = null, namespace = null): FormData
{
    let fd = form || new FormData();
    let formKey;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = namespace + '[' + property + ']';
            } else {
                formKey = property;
            }
            if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                toFormData(obj[property], fd, property);
            } else {
                fd.append(formKey, obj[property]);
            }
        }
    }
    return fd;
}