export class MissingRequestParamException extends Error
{
    type = 'Service';

    constructor(param:string)
    {
        super(`parameter ${param} is missing`);
    }
}

export class ServiceNotFoundException extends Error
{
    type = 'Service'

    constructor(service:string)
    {
        super(`service ${service} is not defined`);
    }
}

export class InvalidParametersException extends Error
{
    type = 'Service';

    constructor(message:string)
    {
        super(message);
    }

}