import { template } from './Templates';
import * as fs from 'fs';
import { ISrvDefinition } from '../common/interfaces';


export class DefWriter
{
    invoke(srvDef:ISrvDefinition, type:string, out:string)
    {
        let content = template(srvDef, type);
        fs.writeFileSync(out, content);
   }
}