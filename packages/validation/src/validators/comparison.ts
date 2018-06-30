export function equalTo(opt){
    return function(val, key, ){
        if(val != opt){
            return 'not equal to '+opt
        }
    }
}
export function identicalTo(opt){
    return function(val, key){
        if(val !== opt){
            return 'not equal to '+opt
        }
    }
}

