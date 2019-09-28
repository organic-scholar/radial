import * as express from 'express';
import * as http from 'http';
import * as  morgan from 'morgan';
import * as bodyParser from 'body-parser';
import {FnServer} from '../src/server/base'
import {schema, GetUser, User, metadata} from './fn.server';
import { JSONSchema6 } from 'json-schema';
import { IMetadata } from '../src/common/interfaces';

let app = express();

app.use(morgan('test'));
app.use(bodyParser());

// class GetUserImpl extends GetUser
// {
// 	public invoke(id: string): Promise<User>
// 	{
// 		let user:User = {
// 			username: 'nauman',
// 			contact: {
// 				method: '1'
// 			}
// 		}
// 		return Promise.resolve(user);
// 	}
// }

let fn = new FnServer(schema as JSONSchema6, metadata as IMetadata);
// fn.add(GetUsrImpl);

// app.use('/api', fn.handle)

let server = http.createServer(app);
let port = 9000;

server.listen(port, ()=>
{
		console.log(`Started on port ${port}`);
});

