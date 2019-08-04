import { ISrvRequestParam, IResponseResult } from '../common/interfaces';

export class InvalidResponseException extends Error
{
    type = 'InvalidResponse';

    constructor(protected data:object)
    {
        super('unable to parse response');
    }
}

export class NetworkError extends Error {

    type = 'NetworkError';

    message = 'failed to send request';

}

export interface IRequestConfig extends RequestInit
{
    url:string;
    interceptors?: {
        request?: ((config:IRequestConfig)=> IRequestConfig | Promise<IRequestConfig>)[]
        response?: ((result:Response)=> Response | Promise<Response>)[]
    }
}


export class ServiceRequest
{

    invoke<T>(param:ISrvRequestParam, config:IRequestConfig):Promise<T>
    {
        let promise:Promise<IRequestConfig> = Promise.resolve(config);
        if(config.interceptors)
        {
            let interceptors = config.interceptors.request!;
            promise = interceptors.reduce((prev, next)=>
            {
                return prev.then((config)=>
                {
                    return next(config)
                });
            }, promise);
        }
        return promise.then((config)=>
        {
            let { url, interceptors, ...rest } = config
            rest = { ...rest, body: JSON.stringify({ fn: param }), method: 'POST' }
            return fetch(url, rest).then((res) =>
            {
                return res.json() as IResponseResult<T>;
            })
            .then((result) =>
            {
                if (result.data) return result.data;
                if (result.error) throw Object.assign(new Error(), result.error);
                throw new InvalidResponseException(result);
            }).catch((err) => {
                if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                    return Promise.reject(new NetworkError());
                }
                return Promise.reject(err);
            });
        });

    }
}

export class BatchServiceRequest
{
    invoke(params:ISrvRequestParam[], config:IRequestConfig):Promise<IResponseResult[]>
    {
        if(params.length == 0) return Promise.resolve([]);
        let {url, interceptors, ...rest} = config
        rest  = {...rest, body: JSON.stringify({fn: params}), method: 'POST'}
        return fetch(url, rest).then((res)=> res.json())
        .then((result)=>
        {
            if(Array.isArray(result)) return result;
            throw new InvalidResponseException(result);
        })
        .catch((err)=>
        {
            if(err.name === 'TypeError')
            {
                return Promise.reject(new NetworkError());
            }
            return Promise.reject(err);
        });
    }
}