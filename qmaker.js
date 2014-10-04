#!/usr/bin/env node

var assert = require( 'assert' )
  , path = require( 'path' )
  , base = require( './base' );

function Qmaker(controller, options ) {

	assert( typeof options !== 'undefined' );
	assert( typeof options.hasOwnProperty( 'workingDir' ) );	
	assert( typeof options.hasOwnProperty( 'buildDir' ) );	

	controller.on( 'generate', function( sum ) {
		
		var args = [];

		args.push( options.defPath ); 
		args = args.concat( options.qmakeOptions );
		args = args.concat( '-o', path.join( options.buildDir, sum, 'Makefile' ) ); 

		var emitter = base.makeProcessor({ 
				cmd: options.qmakePath, 
				args: args, 
				cwd: options.buildDir 
			});

		emitter.once( 'exit', function( code, signal ) { 
			if (!code) {
				controller.emit( 'build', sum );
			}
		});

		controller.emit( 'step', 'qmake' ); 
		emitter.emit( 'execute' );
	});

}

module.exports = Qmaker;