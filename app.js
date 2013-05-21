var colors = require('colors'),
	express = require('express'),
	spdy = require('spdy'),
	fs = require('fs'),
	certificates ={
		key: fs.readFileSync(__dirname + '/public/keys/key.pem'),
		cert: fs.readFileSync(__dirname + '/public/keys/cert.crt'),
		ca: fs.readFileSync(__dirname + '/public/keys/cert.csr')
	},
	model = require('./model'),
	routes = require('./routes'),
	config = require('./config'),
	io = require('socket.io'),
	app = express(),
	httpServer = express(),
	server;

model.connect('test');
config(app);
routes(app, httpServer);

httpServer.listen(80, function(){
	console.log('Redirect server listning to port'.cyan + ' 80'.green);
});

server = spdy.createServer(certificates, app);
io.listen(server);
server.listen(443, function(){
	console.log('Express server listening on port'.cyan + ' 443'.green);
});