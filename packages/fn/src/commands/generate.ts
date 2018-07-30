import {Command, flags} from '@oclif/command'
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { DefParser } from '../parser/DefParser';
import { Server } from 'tls';
import { DefWriter } from '../parser/DefWriter';

export default class Generate extends Command
{
  static description = 'generates service definitions'

  static examples = [];

  static flags = {
 }

  static args = [{name: 'file'}]

  async run()
  {
    const {args, flags} = this.parse(Generate);
    let filePath = path.resolve(process.cwd(), args.file || 'fn.yml');
    if(fs.existsSync(filePath) === false) this.error('service definition source not found');
    let content = fs.readFileSync(filePath).toString();
    let schema = yaml.load(content);
    let srvDef = new DefParser().invoke(schema);
    let out = this.getOutPath(args);
    new DefWriter().invoke(srvDef, out);
  }
  getOutPath(args:any)
  {
    if(args.out) return args.out;
    return process.cwd() + '/service.fn.ts';
  }
}
