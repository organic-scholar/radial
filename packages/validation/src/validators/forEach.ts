import { validate } from "../validator";
import { setInMutable } from "@radial/helpers";

export function forEach(rules)
{
    return function(val, key)
    {
        if(Array.isArray(val) === false) return;
        let errors = {};
        let promises = val.map((data, index)=>
        {
            let path = '' + index;

            let promise = validate(data, rules);

            return promise.catch((err)=>
            {
                setInMutable(errors, path, err.errors || err);
            });
        });
        return Promise.all(promises).then(()=>
        {
            if(Object.keys(errors).length === 0) return;
            return errors;
        })
    }
}