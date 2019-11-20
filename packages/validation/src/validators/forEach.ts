import { validate, IValidationRules } from "../main";
import { setIn } from "../common";

export function forEach(rules:IValidationRules)
{
    return function(val:any, key:string)
    {
        if(Array.isArray(val) === false) return;
        let errors = {};
        let promises = val.map((data, index)=>
        {
            let path = '' + index;

            let promise = validate(data, rules);

            return promise.catch((err)=>
            {
                setIn(errors, path, err.data || err);
            });
        });
        return Promise.all(promises).then(()=>
        {
            if(Object.keys(errors).length === 0) return;
            return errors;
        })
    }
}