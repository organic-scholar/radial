import { ISrvDefinition } from './DefParser';
import { template } from './Templates';
import * as fs from 'fs';


export class DefWriter
{
    invoke(srvDef:ISrvDefinition, type:string, out:string)
    {
        let content = template(srvDef, type);
        fs.writeFileSync(out, content);
   }
}