import { ITypeSerializer } from "../ITypeSerializer";

export class StringSerializer implements ITypeSerializer<string>
{
    deserialize(value: any): string
    {
        if(value && value.toString) return value.toString();
        return value;
    }
    serialize(value: string): string {
        throw new Error("Method not implemented.");
    }

}