export function equalTo(opt) {
    return function (val, key) {
        if (val != opt) {
            return 'equalTo';
        }
    };
}
export function identicalTo(opt) {
    return function (val, key) {
        if (val !== opt) {
            return 'identicalTo';
        }
    };
}
