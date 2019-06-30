export interface ISrvRequestParam
{
    service:string;
    params:object;
}
export interface IResponseResult<T={}>
{
    data?:T;
    error?:IResponseError
}

export interface IResponseError
{
    message:string;
    type:string;
    data?:object;
}