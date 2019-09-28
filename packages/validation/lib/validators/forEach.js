import { validate } from "../main";
import { setIn } from "../common";
export function forEach(rules) {
    return function (val, key) {
        if (Array.isArray(val) === false)
            return;
        var errors = {};
        var promises = val.map(function (data, index) {
            var path = '' + index;
            var promise = validate(data, rules);
            return promise.catch(function (err) {
                setIn(errors, path, err.errors || err);
            });
        });
        return Promise.all(promises).then(function () {
            if (Object.keys(errors).length === 0)
                return;
            return errors;
        });
    };
}
