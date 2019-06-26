import { ITypeSerializer } from "../ITypeSerializer";

export class BooleanSerializer implements ITypeSerializer<boolean>
{
    deserialize(value: any): boolean
    {
        return JSON.parse(value);
    }
    serialize(value: boolean): string
    {
        return JSON.stringify(value);
    }

}