import * as express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {FnServer} from '../src/server'

let app = express();

app.use(morgan('test'));
app.use(bodyParser());

// let fn = new FnServer();

// app.use('/api', new FnServer().handle)

let server = http.createServer(app);
let port = 9000;

server.listen(port, ()=>
{
		console.log(`Started on port ${port}`);
});

