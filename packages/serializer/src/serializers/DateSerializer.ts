import { ITypeSerializer } from "../ITypeSerializer";

export class DateSerializer implements ITypeSerializer<Date>
{
    deserialize(value: any): Date
    {
        if(!value) return value;
        if(value instanceof Date) return value;
        return new Date(value);
    }
    serialize(value: Date): string {
        throw new Error("Method not implemented.");
    }

}