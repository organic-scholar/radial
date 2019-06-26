import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export class DefsResolver
{
    async invoke(schema:any, dir:string)
    {
        for(let key in schema)
        {
            let value = schema[key];
            if(typeof value === 'object') await this.invoke(value, dir);
            if(key === '$ref')
            {
                let include = path.join(dir, schema[key]);
                delete schema[key];
                let content = await this.readFile(include);
                let values = yaml.load(content);
                values = await this.invoke(values, path.dirname(include));
                Object.assign(schema, values);
            }
        }
        return schema;
    }
    readFile(filePath:string):any
    {
        return new Promise((resolve, reject)=>
        {
            fs.readFile(filePath, (err, content)=>
            {
                if(err) return reject(err);
                resolve(content.toString());
            })
        });
    }
}