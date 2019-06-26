import {schema, GetUser} from './service.fn';
import * as Ajv from 'ajv';

let ajv = new Ajv();

let validate = ajv.compile(Object.assign(schema, GetUser.args));


let result = validate({
    id: '123'
});

console.log(validate.errors);