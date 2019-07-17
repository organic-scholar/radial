import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import fetch from 'node-fetch';

export class DefsResolver
{
    async invoke(filePath:string)
    {
        let out = {
            Types: {},
            Services: {}
        };
        let dir = path.dirname(filePath);
        let schema = await this.readFile(filePath);
        if(schema.imports)
        {
            let promises = schema.imports.map(async (segment:string)=>
            {
                let filePath = path.resolve(dir, segment);
                let schema = await this.invoke(filePath);
                Object.assign(out.Types, schema.Types);
                Object.assign(out.Services, schema.Services);
            });
            await Promise.all(promises);
        }
        else Object.assign(out, schema);
        return out;
    }
    readFile(filePath:string):any
    {
        if (filePath.startsWith('http'))
        {
            let body = JSON.stringify({
                fn: {
                    service: 'GetMetadata',
                    param: null
                }

            });
            return fetch(filePath, {method: 'POST', body: body}).then((res) =>
            {
                return res.json()
            }).then((json)=> json.data);
        }
        return new Promise((resolve, reject) =>
        {
            fs.readFile(filePath, (err, content) =>
            {
                if (err) return reject(err);
                resolve(yaml.load(content.toString()));
            })
        });
    }
}