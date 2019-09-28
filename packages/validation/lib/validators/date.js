export function isAfter(date, key) {
    return function (val, _) {
        if (val instanceof Date && date instanceof Date) {
            if (val.getTime() > date.getTime())
                return;
            return _ + ' must be after ' + key;
        }
    };
}
export function isBefore(date, key) {
    return function (val, _) {
        if (val instanceof Date && date instanceof Date) {
            if (val.getTime() < date.getTime())
                return;
            return _ + ' must be before ' + key;
        }
    };
}
