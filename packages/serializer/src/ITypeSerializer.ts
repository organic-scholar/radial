
export interface ITypeSerializer<T>
{

    deserialize(value:any):T
    serialize(value:T):string;

}