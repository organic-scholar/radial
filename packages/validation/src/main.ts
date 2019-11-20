import { getIn, setIn } from "./common";


function validateValue(value:any, path:string, validators:Array<Function>, data:any)
{
    let result = validators.map((validator)=>
    {
        let blank = value === undefined || value === null || value === NaN || value === '';
        if(!blank || validator['nullable']) return validator(value, path, data, {})
        return Promise.resolve();
    });
    return Promise.all(result).then((errors)=>
    { 
        return errors.filter(function (error)
        {
            return error != null;
        });
    }).then((err)=>
    {
        return err.length == 0 ? Promise.resolve() : Promise.reject(err);
    });

}

export function validate(data:object, rules:IValidationRules={})
{
    let errors = {};

    let promises = Object.keys(rules).map((key:string)=>
    {
        let val = getIn(data, key);

        return validateValue(val, key, rules[key], data).catch((err)=>
        {
            setIn(errors, key, err);
        });
    });

    return Promise.all(promises).then(()=>
    {
        if (Object.keys(errors).length == 0) return;
        return Promise.reject(new ValidationException(errors));
    });
}

interface IValidationRules {
    [key:string]: IValidationRule[]
}

type IValidationRule  = (value:any, key:string, data:any)=> (void|string)|Promise<string|void>

export class ValidationException extends Error
{

    data:ValidationError;

    statusCode = 422;

    type = 'Validation';

    constructor(errors:ValidationError)
    {
        super('validation errors');
        this.data = errors;
        Object.setPrototypeOf(this, ValidationException.prototype);
    }
}


export interface ValidationError
{
    [key: string]: Array<string>
}


