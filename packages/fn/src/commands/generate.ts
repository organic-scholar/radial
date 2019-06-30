import {Command, flags} from '@oclif/command'
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { DefParser } from '../parser/DefParser';
import { DefWriter } from '../parser/DefWriter';

export default class Generate extends Command
{
  static description = 'generates service definitions'

  static examples = [];

  static flags = {
    client: flags.boolean(),
    out: flags.string({default: './service.fn.ts'})
  }

  static args = [
    {name: 'src', default: 'fn.yml'},
  ];

  async run()
  {
    const {args, flags} = this.parse(Generate);
    let filePath = this.normalizePath(args.src);
    if(fs.existsSync(filePath) === false) this.error('service definition source not found');
    let content = fs.readFileSync(filePath).toString();
    let schema = yaml.load(content);
    let srvDef = new DefParser().invoke(schema);
    let out = this.normalizePath(flags.out);
    let type = flags.client ? 'client' : 'server';
    new DefWriter().invoke(srvDef, type, out);
  }
  normalizePath(seg?:string)
  {
    return path.resolve(process.cwd(),  seg || '');
  }
}
