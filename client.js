#!/usr/bin/env node

var socketio = require('socket.io-client')
  , socket = socketio.connect('http://localhost:3001');

socket.on('connect', function () {
	socket.on( 'data', function( data ) {
		process.stdout.write( data.toString() ); 
	});
});