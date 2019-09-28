export let schema = {"definitions":{"string":{"type":"string"},"boolean":{"type":"boolean"},"number":{"type":"integer"},"Device":{"type":"object","properties":{"id":{"$ref":"#/definitions/string"},"code":{"$ref":"#/definitions/string"},"deviceId":{"$ref":"#/definitions/string"},"osName":{"$ref":"#/definitions/string"},"osVersion":{"$ref":"#/definitions/string"},"model":{"$ref":"#/definitions/string"},"status":{"$ref":"#/definitions/string"},"manufacturer":{"$ref":"#/definitions/string"},"companyId":{"$ref":"#/definitions/string"},"locationId":{"$ref":"#/definitions/string"}},"required":["id","code","deviceId","osName","osVersion","model","status","manufacturer"]}}}
export interface Device
{
    id:string
code:string
deviceId:string
osName:string
osVersion:string
model:string
status:string
manufacturer:string
companyId?:string
locationId?:string
}

export abstract class RegisterDevice
{
    static serviceName = 'RegisterDevice';

    static args = ["deviceId","model","osName","osVersion","manufacturer"]

    static argsSchema = {"type":"object","properties":{"deviceId":{"$ref":"#/definitions/string"},"model":{"$ref":"#/definitions/string"},"osName":{"$ref":"#/definitions/string"},"osVersion":{"$ref":"#/definitions/string"},"manufacturer":{"$ref":"#/definitions/string"}},"required":["deviceId","model","osName","osVersion","manufacturer"]};

    static returnSchema = {"type":"object","properties":{"return":{"$ref":"#/definitions/Device"}},"required":["return"]}

    public abstract invoke(deviceId :string, model :string, osName :string, osVersion :string, manufacturer :string):Promise<Device>;
}
        