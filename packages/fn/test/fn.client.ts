
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
import {IRequestConfig, Transaction, callService} from '@radial/fn/lib/client'

export class RegisterDevice
{
    static serviceName = 'RegisterDevice';

    static args = ["deviceId","model","osName","osVersion","manufacturer"]

    constructor(public config:IRequestConfig|Transaction)
    {

    }
    public invoke(deviceId :string, model :string, osName :string, osVersion :string, manufacturer :string):Promise<Device>
    {
        return callService(this, arguments);
    }
}
