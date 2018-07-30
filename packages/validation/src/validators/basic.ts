import {isBlank, interpolate} from '@radial/helpers';


export function notBlank(){
    let func = function(val, key)
    {
        if(isBlank(val))
        {
            return interpolate(notBlank['message'], {key: key});
        }
    }
    func['allowNil'] = true;
    return func;
}
notBlank['message'] = 'This is required';

export function notNull(){
    return function(val, key){
        if(val === null || val === undefined){
            return interpolate(notNull['message'], {key: key});
        }
    }
}
notNull['message'] = 'This cannot be null';

export function isTrue(val){
    return function(val)
    {
        if(val !== true){
            return "This is not a true value."
        }
    };
}


export function isFalse(){
    return function(val){
        if(val !== false){
            return "is not a false value."
        }
    }
}
function type(){

}

