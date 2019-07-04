import { ISrvRequestParam, IResponseResult } from '../common/interfaces';


export class NetworkError extends Error {

    type = 'NetworkError';

    message = 'failed to send request';

}

export interface IRequestConfig extends RequestInit
{
    url:string;
    interceptors?: {
        request?: (config:IRequestConfig)=> IRequestConfig | Promise<IRequestConfig>[]
        response?: (result:Response)=> Response | Promise<Response>[]
    }
}


export class ServiceRequest
{

    invoke<T>(param:ISrvRequestParam, config:IRequestConfig):Promise<T>
    {
        let {url, interceptors, ...rest} = config
        rest  = {...rest, body: JSON.stringify({fn: param})}
        return fetch(url, rest).then((res)=>
        {
            return res.json() as IResponseResult<T>;
        })
        .then((result)=>
        {
            if(result.data) return result.data;
            if(result.error) throw Object.assign(new Error(), result.error);
            throw new Error();
        }).catch((err)=>
        {
            if(err.name === 'TypeError' && err.mesasge === 'Failed to fetch')
            {

            }
            return Promise.reject(new NetworkError());
        });
    }
}

export class BatchServiceRequest
{
    invoke(params:ISrvRequestParam[], config:IRequestConfig):Promise<IResponseResult[]>
    {
        if(params.length == 0) return Promise.resolve([]);
        let {url, interceptors, ...rest} = config
        rest  = {...rest, body: JSON.stringify({fn: params})}
        return fetch(url, rest).then((res)=> res.json())
        .catch(()=>
        {
            return Promise.reject(new NetworkError());
        });
    }
}