import axios, { AxiosError } from 'axios';

export interface IRequestParam {
    uri:string;
    service:string;
    params:object;
}

interface IResponseBody
{
    data?:any;
    error?:IResponseError
}

interface IResponseError
{
    message:string;
    type:string;
    data?:any;
    
}

export class Request
{

    invoke(arg:IRequestParam)
    {
        axios.post(arg.uri, {fn: {params: arg.params, service: arg.service}}).then((response)=>
        {
            let result:IResponseBody = response.data.result;
            if(result.data) return result.data;
            if(result.error) return Promise.reject(Object.assign(new Error(), result.error))
        }).catch((err:AxiosError)=>
        {
            if(!err.response) return;
            err.response.data;
        });
    }
}

export class BatchRequest
{
    invoke(args:IRequestParam[])
    {

    }
}