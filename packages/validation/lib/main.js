var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { getIn, setIn } from "./common";
var ValidationException = /** @class */ (function (_super) {
    __extends(ValidationException, _super);
    function ValidationException(errors) {
        var _this = _super.call(this, 'validation errors') || this;
        _this.statusCode = 422;
        _this.type = 'Validation';
        _this.data = errors;
        return _this;
    }
    return ValidationException;
}(Error));
export { ValidationException };
function validateValue(value, path, validators, data) {
    var result = validators.map(function (validator) {
        var isNil = value === undefined || value === null || value === NaN;
        if (isNil && validator['allowNil'] !== true)
            return Promise.resolve();
        return Promise.resolve(validator(value, path, data, {}));
    });
    return Promise.all(result).then(function (errors) {
        return errors.filter(function (error) {
            return error !== undefined && error !== null;
        });
    }).then(function (err) {
        return err.length == 0 ? Promise.resolve() : Promise.reject(err);
    });
}
export function validate(data, rules) {
    if (data === void 0) { data = {}; }
    if (rules === void 0) { rules = {}; }
    if (Array.isArray(rules)) {
        return validateValue(data, '', rules, data).then(function () {
            return null;
        })
            .catch(function (err) {
            return Promise.reject(new ValidationException(err));
        });
    }
    var errors = {};
    var promises = Object.keys(rules).map(function (key) {
        var val = getIn(data, key);
        return validateValue(val, key, rules[key], data).catch(function (err) {
            setIn(errors, key, err);
        });
    });
    return Promise.all(promises).then(function () {
        if (Object.keys(errors).length == 0)
            return;
        return Promise.reject(new ValidationException(errors));
    });
}
