export function callback(cb) {
    return function (val, key) {
        return cb(val, cb);
    };
}
export function typeOf(string) {
    return function (val, key) {
        if (typeof val === string)
            return null;
        return 'typeOf';
    };
}
export function instanceOf(Type) {
    return function (val, key) {
        if (val instanceof Type)
            return null;
        return 'instanceOf';
    };
}
