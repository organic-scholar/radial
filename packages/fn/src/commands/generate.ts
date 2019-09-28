import {Command, flags} from '@oclif/command'
import * as path from 'path';
import { DefParser } from '../parser/DefParser';
import { DefWriter } from '../parser/DefWriter';
import { DefsResolver } from '../parser/DefsResolver';

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
    let definition = await new DefsResolver().invoke(this.normalizePath(args.src));
    let srvDef = new DefParser().invoke(definition);
    let out = this.normalizePath(flags.out);
    let type = flags.client ? 'client' : 'server';
    new DefWriter().invoke(srvDef, type, out);
  }
  normalizePath(seg:string='')
  {
    if(seg.startsWith('http')) return seg;
    return path.resolve(process.cwd(),  seg || '');
  }
}
