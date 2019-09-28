export function setIn(obj, path, value) {
    var current = obj;
    var stack = path.split('.');
    while (stack.length > 1) {
        var i = stack.shift();
        if (current[i] == undefined) {
            current[i] = {};
        }
        current = current[i];
    }
    current[stack.shift()] = value;
    return obj;
}
export function getIn(obj, path) {
    var p = path.split('.');
    for (var i = 0; i < p.length; i++) {
        obj = obj[p[i]];
    }
    return obj;
}
