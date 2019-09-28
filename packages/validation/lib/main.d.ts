export declare class ValidationException extends Error {
    data: ValidationError | string[];
    statusCode: number;
    type: string;
    constructor(errors: ValidationError | string[]);
}
export declare function validate(data?: any, rules?: any): Promise<any>;
export interface ValidationError {
    [key: string]: Array<string>;
}
