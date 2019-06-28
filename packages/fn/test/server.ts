import * as express from 'express';
import * as http from 'http';
import * as  morgan from 'morgan';
import * as bodyParser from 'body-parser';
import {FnServer} from '../src/server'
import {schema, GetUser, User} from '../service.fn';
import { JSONSchema6 } from 'json-schema';

let app = express();

app.use(morgan('test'));
app.use(bodyParser());

class GetUserImpl extends GetUser
{
	public invoke(id: string): Promise<User>
	{
		let user:User = {
			username: 'nauman',
			contact: {method: 'tel'}
		}
		return Promise.resolve(user);
	}
}

let fn = new FnServer(schema as JSONSchema6);
fn.add(GetUserImpl);

app.use('/api', fn.handle)

let server = http.createServer(app);
let port = 9000;

server.listen(port, ()=>
{
		console.log(`Started on port ${port}`);
});

