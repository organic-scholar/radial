import { ISrvDefinition } from './DefParser';
import { Template } from './Templates';
import * as ejs from 'ejs';
import * as fs from 'fs';

export class DefWriter
{
    invoke(srvDef:ISrvDefinition, out:string)
    {
        let content = ejs.render(Template, srvDef);
        fs.writeFileSync(out, content);
   }
}