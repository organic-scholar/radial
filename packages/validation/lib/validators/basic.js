export function isBlank(val) {
    if (val === null || val === undefined)
        return true;
    if (typeof val === 'string' && val.length === 0)
        return true;
    if (Array.isArray(val) && val.length === 0)
        return true;
    return false;
}
export function notBlank() {
    var func = function (val, key) {
        if (isBlank(val)) {
            return 'notBlank';
        }
    };
    func['allowNil'] = true;
    return func;
}
export function notNull() {
    var func = function (val, key) {
        if (val === null) {
            return 'notNull';
        }
    };
    func['allowNil'] = true;
    return func;
}
