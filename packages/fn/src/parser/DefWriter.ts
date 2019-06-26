import { ISrvDefinition } from './DefParser';
import { template } from './Templates';
import * as fs from 'fs';

export class DefWriter
{
    invoke(srvDef:ISrvDefinition, out:string)
    {
        let content = template(srvDef);
        fs.writeFileSync(out, content);
   }
}