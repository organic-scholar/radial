import { ITypeSerializer } from "../ITypeSerializer";

export class NumberSerializer implements ITypeSerializer<number>
{
    deserialize(value: any): number
    {
        if(value) return parseFloat(value);
        return value;
    }
    serialize(value: number): string
    {
        throw new Error("Method not implemented.");
    }

}