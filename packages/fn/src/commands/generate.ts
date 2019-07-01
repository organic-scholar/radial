import {Command, flags} from '@oclif/command'
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { DefParser } from '../parser/DefParser';
import { DefWriter } from '../parser/DefWriter';
import fetch from 'node-fetch';
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
    let definition = await this.getContent(args.src);
    definition = await new DefsResolver().invoke(definition, this.normalizePath(args.src) );
    let srvDef = new DefParser().invoke(definition);
    let out = this.normalizePath(flags.out);
    let type = flags.client ? 'client' : 'server';
    new DefWriter().invoke(srvDef, type, out);
  }
  normalizePath(seg?:string)
  {
    return path.resolve(process.cwd(),  seg || '');
  }
  getContent(path:string)
  {
    if(path.startsWith('http'))
    {
      return fetch(path).then((res)=>
      {
        return res.json()
      })
    }
    let filePath = this.normalizePath(path);
    if(fs.existsSync(filePath) === false) this.error('service definition source not found');
    let content = fs.readFileSync(filePath).toString();
    return Promise.resolve(yaml.load(content));

  }
}
