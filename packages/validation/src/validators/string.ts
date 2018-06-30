import {isBlank, interpolate} from '@radial/helpers';

export function length(min:number, max:number){
    return function(val, key){
        if(isBlank(val)) return;
        if(val.length < min){
            return 'too short use at least '+min+' characters.';
        }
        if(val.length > max ){
            return 'too long '+max+' characters allowed';
        }
    }
}

export function email(){
    return function(val, key){
        if(isBlank(val)) return;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(false === re.test(val)){
            return interpolate(email['message'], {key: key});
        }
    }
}
email['message'] = 'This is not valid email address';

export function containsIn(values:Array<any>)
{
    return function (val, key){
        if(values.indexOf(val) === -1){
            return interpolate(containsIn['message'], {key: key});
        }
    }
}
containsIn['message'] = 'This is not a valid value';

export function alpha(numeric=false){
    return function(val, key){
        let regexp = numeric ? /^[0-9a-zA-Z]+$/ : /^[a-zA-Z]+$/;
        if(val.match(regexp)) return;
        return interpolate(alpha['message'], {key: key});
    };
}
alpha['message'] = 'contains invalid characters';

export function alphaSpace(numeric=false)
{
    return function(val, key)
    {
        let regexp =  numeric ? /^[0-9a-z\s]+$/i : /^[a-z\s]+$/i
        if(val.match(regexp)) return;
        return interpolate(alphaSpace['message'], {key: key});
    };

}

alphaSpace['message'] = 'contains invalid characters';


