#!/usr/bin/env node

var client = require('socket.io-client')
  , prompt = require('prompt')
  , socket = client.connect('http://localhost:3001');

socket.once('connect', function () {
	
	console.log( 'got connnection' );

	prompt.start();
	readCommand();

    socket.on( 'pipeOut', function( data ) {
      process.stdout.write( data.toString() );
    } );

	function readCommand() {
		prompt.get( ['command'], function(err, result) {
			if (err) throw err;
			socket.emit( 'command', result.command );	
			readCommand(); 
		});
	}
});