#!/usr/bin/env node

var assert = require( 'assert' )
  , applescript = require("applescript")
  , cp = require( 'child_process' )
  , join = require( 'path' ).join;

function Runner(controller, options) {

	assert( typeof options !== 'undefined' );
	assert( options.hasOwnProperty( 'buildDir' ) ); 
	
	controller.on( 'run', function() { 
	  	var path = join( options.buildDir, "BookWright.app/Contents/MacOS/BookWright" );

	  	controller.emit( 'step', 'run' ); 
		cp.spawn( path, [ '--project=~/assets/dummys/small_square_empty.blurb'], { stdio: 'inherit' } ); 
	});
}

if (process.argv[1].indexOf('runner.js') != -1) {
	var program = require( 'commander' ); 

	program.version( '0.0.0' )
	  .option( '-b --buildDir [path]', 'target build directory' )
	  .parse( process.argv ); 

	if (program.buildDir) {
		var events = require( 'events' )
		  , controller = new events.EventEmitter()
		  , runner = new Runner( controller, program );
		controller.emit( 'run' );
	}
	else {
		program.help();
	}
}
else {
	module.exports = Runner;	
}
