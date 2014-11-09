#!/usr/bin/env node

var client = require('socket.io-client')
  , prompt = require('prompt')
  , socket = client.connect('http://localhost:3001');

socket.on('connect', function () {
	prompt.start();
	readCommand();

	function readCommand() {
		prompt.get( ['command'], function(err, result) {
			if (err) throw err;
			socket.emit( 'command', result );	
			readCommand(); 
		});
	}
});