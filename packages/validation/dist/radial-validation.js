(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@radial/helpers')) :
    typeof define === 'function' && define.amd ? define(['exports', '@radial/helpers'], factory) :
    (factory((global.RadialValidation = {}),global.helpers));
}(this, (function (exports,helpers) { 'use strict';

    var __extends = (undefined && undefined.__extends) || (function () {
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
    var setIn = helpers.setInMutable;
    var ValidationException = /** @class */ (function (_super) {
        __extends(ValidationException, _super);
        function ValidationException(errors) {
            var _this = _super.call(this, 'validation errors') || this;
            _this.errors = errors;
            return _this;
        }
        return ValidationException;
    }(Error));
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
    function validate(data, rules) {
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
        var results = Object.keys(rules).map(function (key) {
            var val = helpers.getIn(data, key);
            return validateValue(val, key, rules[key], data).catch(function (err) {
                setIn(errors, key, err);
            });
        });
        return new Promise(function (resolve, reject) {
            Promise.all(results).then(function () {
                if (Object.keys(errors).length == 0) {
                    return resolve();
                }
                reject(new ValidationException(errors));
            });
        });
    }

    function notBlank() {
        var func = function (val, key) {
            if (helpers.isBlank(val)) {
                return helpers.interpolate(notBlank['message'], { key: key });
            }
        };
        func['allowNil'] = true;
        return func;
    }
    notBlank['message'] = 'This is required';
    function notNull() {
        return function (val, key) {
            if (val === null || val === undefined) {
                return helpers.interpolate(notNull['message'], { key: key });
            }
        };
    }
    notNull['message'] = 'This cannot be null';
    function isTrue(val) {
        return function (val) {
            if (val !== true) {
                return "This is not a true value.";
            }
        };
    }
    function isFalse() {
        return function (val) {
            if (val !== false) {
                return "is not a false value.";
            }
        };
    }

    function equalTo(opt) {
        return function (val, key) {
            if (val != opt) {
                return 'not equal to ' + opt;
            }
        };
    }
    function identicalTo(opt) {
        return function (val, key) {
            if (val !== opt) {
                return 'not equal to ' + opt;
            }
        };
    }

    function length(min, max) {
        return function (val, key) {
            if (helpers.isBlank(val))
                return;
            if (val.length < min) {
                return 'too short use at least ' + min + ' characters.';
            }
            if (val.length > max) {
                return 'too long ' + max + ' characters allowed';
            }
        };
    }
    function email() {
        return function (val, key) {
            if (helpers.isBlank(val))
                return;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (false === re.test(val)) {
                return helpers.interpolate(email['message'], { key: key });
            }
        };
    }
    email['message'] = 'This is not valid email address';
    function containsIn(values) {
        return function (val, key) {
            if (values.indexOf(val) === -1) {
                return helpers.interpolate(containsIn['message'], { key: key });
            }
        };
    }
    containsIn['message'] = 'This is not a valid value';
    function alpha(numeric) {
        if (numeric === void 0) { numeric = false; }
        return function (val, key) {
            var regexp = numeric ? /^[0-9a-zA-Z]+$/ : /^[a-zA-Z]+$/;
            if (val.match(regexp))
                return;
            return helpers.interpolate(alpha['message'], { key: key });
        };
    }
    alpha['message'] = 'contains invalid characters';
    function alphaSpace(numeric) {
        if (numeric === void 0) { numeric = false; }
        return function (val, key) {
            var regexp = numeric ? /^[0-9a-z\s]+$/i : /^[a-z\s]+$/i;
            if (val.match(regexp))
                return;
            return helpers.interpolate(alphaSpace['message'], { key: key });
        };
    }
    alphaSpace['message'] = 'contains invalid characters';

    function callback(cb) {
        return function (val, key) {
            return cb(val, cb);
        };
    }
    function typeOf(string) {
        return function (val, key) {
            if (typeof val === string)
                return null;
            return 'invalid type';
        };
    }
    function instanceOf(Type) {
        return function (val, key) {
            if (val instanceof Type)
                return null;
            return 'invalid type';
        };
    }

    function isAfter(date, key) {
        return function (val, _) {
            if (val instanceof Date && date instanceof Date) {
                if (val.getTime() > date.getTime())
                    return;
                return _ + ' must be after ' + key;
            }
        };
    }
    function isBefore(date, key) {
        return function (val, _) {
            if (val instanceof Date && date instanceof Date) {
                if (val.getTime() < date.getTime())
                    return;
                return _ + ' must be before ' + key;
            }
        };
    }

    function forEach(rules) {
        return function (val, key) {
            if (Array.isArray(val) === false)
                return;
            var errors = {};
            var promises = val.map(function (data, index) {
                var path = '' + index;
                var promise = validate(data, rules);
                return promise.catch(function (err) {
                    helpers.setInMutable(errors, path, err.errors || err);
                });
            });
            return Promise.all(promises).then(function () {
                if (Object.keys(errors).length === 0)
                    return;
                return errors;
            });
        };
    }

    exports.ValidationException = ValidationException;
    exports.validate = validate;
    exports.notBlank = notBlank;
    exports.notNull = notNull;
    exports.isTrue = isTrue;
    exports.isFalse = isFalse;
    exports.equalTo = equalTo;
    exports.identicalTo = identicalTo;
    exports.length = length;
    exports.email = email;
    exports.containsIn = containsIn;
    exports.alpha = alpha;
    exports.alphaSpace = alphaSpace;
    exports.callback = callback;
    exports.typeOf = typeOf;
    exports.instanceOf = instanceOf;
    exports.isAfter = isAfter;
    exports.isBefore = isBefore;
    exports.forEach = forEach;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
