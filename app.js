/*eslint-env node*/
"use strict";

let colors = require('colors');
let express = require('express');
let spdy = require('spdy');
let fs = require('fs');
let certificates = {
		key: fs.readFileSync(__dirname + '/public/keys/key.pem'),
		cert: fs.readFileSync(__dirname + '/public/keys/cert.crt'),
		ca: fs.readFileSync(__dirname + '/public/keys/ca.crt'),
};
let model = require('./model');
let routes = require('./routes');
let config = require('./config');
let io = require('socket.io');
let app = express();
let httpServer = express();
let server;

//TODO: add user & password autentication for good
//TODO: decouple db connection from controller?
model.connect('test');
httpServer.disable('x-powered-by');
config(app);
routes(app, httpServer);

httpServer.listen(80, function(){
	console.log('Redirect server listning to port'.cyan + ' 80'.green);
});

server = spdy.createServer(certificates, app);
io.listen(server);
server.listen(443, function(){
	console.log('Express server listening on port'.cyan + ' 443'.green);
	if (process.setguid && process.setuid) {
		console.log('Trying to giveup root...'.cyan);
		try {
			process.setgid('node');
			process.setuid('node');
			console.log('Not root anymore.'.green);
		}
		catch (err) {
			console.log('Still root: '.red + err);
		}
	}
});