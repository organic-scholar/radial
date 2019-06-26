import { ITypeSerializer } from "./ITypeSerializer";
import { BooleanSerializer } from "./serializers/BooleanSerializer";
import { StringSerializer } from "./serializers/StringSerializer";
import { DateSerializer } from "./serializers/DateSerializer";
import { NumberSerializer } from "./serializers/NumberSerializer";

export const __TYPES__ = '[[Types]]';

export class Serializer
{
    public typeMap = new WeakMap<any, ITypeSerializer<any>>();

    constructor(){
        this.typeMap.set(Boolean, new BooleanSerializer)
        this.typeMap.set(String, new StringSerializer);
        this.typeMap.set(Date, new DateSerializer);
        this.typeMap.set(Number, new NumberSerializer);
    }
    deserialize<T>(type:T|any, data:any):T
    {
        if(!data) return data;
        if(type[__TYPES__])
        {
            let instance = new type();
            Object.keys(type[__TYPES__]).forEach((name)=>
            {
                let propType = type[__TYPES__][name];
                let value = data[name];
                if(Array.isArray(propType))
                {
                    instance[name]  = this.deserializeArray(propType[0], value);
                }
                else {
                    instance[name] = this.deserialize(propType, value);
                }
            });
            return instance;
        }
        else if (this.typeMap.get(type)) {
            return this.typeMap.get(type).deserialize(data);
        }
        else {
            throw new Error(`unable to deserialize ${type.name || type}`);
        }
    }
    deserializeArray(type, values)
    {
        return values.map((value)=>
        {
            return this.deserialize(type, value);
        })
    }
    addHandler(type, handler)
    {

    }
}


export function type(propType)
{
    return function(Type, prop)
    {
        let constructor = Type.constructor;
        if(!constructor[__TYPES__]) constructor[__TYPES__] = {};
        constructor[__TYPES__][prop] = propType;
    }
}