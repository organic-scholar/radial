import axios from 'axios';

export interface IRequestParam {
    uri:string;
    service:string;
    params:object;
}

interface IResponseResult
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

export class NetworkError extends Error {

    type = 'NetworkError';

    message = 'Unable to send request';

}


export class Request
{

    invoke(arg:IRequestParam)
    {
        return axios.post(arg.uri, {fn: {params: arg.params, service: arg.service}}).then((response)=>
        {
            let result:IResponseResult = response.data.result;
            if(result.data) return result.data;
            if(result.error) return Promise.reject(Object.assign(new Error(), result.error))
        }).catch((err)=>
        {
            if(err.message === 'Network Error')
            {
                return Promise.reject(new NetworkError());
            }
            return Promise.reject(err);
        });
    }
}

export class BatchRequest
{
    invoke(args:IRequestParam[]):Promise<IResponseResult[]>
    {
        let uri = args[0].uri;
        let params = args.map((arg) =>
        {
            return { params: arg.params, service: arg.service }
        });
        return axios.put(uri, {fn: params }).then((res)=>
        {
            let results:IResponseResult[] = res.data.result;
            return results;
        });
    }
}