export declare function length(min: number, max: number): (val: string, key: string) => "minLength" | "maxLength";
export declare function email(): (val: string, key: string) => string;
export declare function containsIn(values: Array<any>): (val: any, key: any) => string;
export declare function alpha(spaces?: boolean): (val: any, key: any) => string;
export declare function alphaNumeric(spaces?: boolean): (val: any, key: any) => string;
