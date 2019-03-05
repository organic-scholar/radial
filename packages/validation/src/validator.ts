import {getIn, setInMutable} from "@radial/helpers";

let setIn = setInMutable;

export class ValidationException extends Error
{

    errors:ValidationError | string[];

    statusCode = 422;

    type = 'Validation';

    constructor(errors){
        super('validation errors');
        this.errors = errors;
    }
}

function validateValue(value:any, path:string, validators:Array<Function>, data:any)
{
    let result = validators.map((validator)=>
    {
        let isNil = value === undefined || value === null || value === NaN;
        if(isNil && validator['allowNil'] !== true) return Promise.resolve();
        return Promise.resolve(validator(value, path, data, {}));
    });
    return Promise.all(result).then(function (errors)
    {
        return errors.filter(function (error)
        {
            return error !== undefined && error !== null;
        });
    }).then(function (err)
    {
        return err.length == 0 ? Promise.resolve() : Promise.reject(err);
    });

}

export function validate(data:any={}, rules:any={})
{

    if(Array.isArray(rules))
    {
        return validateValue(data, '', rules, data).then(()=>
        {
            return null;
        })
        .catch((err)=>
        {
            return Promise.reject(new ValidationException(err));
        });
    }

    let errors = {};

    let results = Object.keys(rules).map(function (key)
    {
        let val = getIn(data, key);

        return validateValue(val, key, rules[key], data).catch((err)=>
        {
            setIn(errors, key, err);

        });
    });

    return new Promise(function (resolve, reject)
    {
        Promise.all(results).then(function () {
            if (Object.keys(errors).length == 0) {
                return resolve();
            }
            reject(new ValidationException(errors));
        });
    });
}

export interface ValidationError {
    [key: string]: Array<string>
}


