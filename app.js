/*jshint node:true*/
var colors = require('colors'),
	express = require('express'),
	spdy = require('spdy'),
	fs = require('fs'),
	certificates = {
		key: fs.readFileSync(__dirname + '/public/keys/key.pem'),
		cert: fs.readFileSync(__dirname + '/public/keys/cert.crt'),
		ca: fs.readFileSync(__dirname + '/public/keys/ca.crt')
	},
	model = require('./model'),
	routes = require('./routes'),
	config = require('./config'),
	io = require('socket.io'),
	app = express(),
	httpServer = express(),
	server;

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
