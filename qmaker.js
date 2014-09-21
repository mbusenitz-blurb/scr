#!/usr/bin/env node

var assert = require( 'assert' )
  , path = require( 'path' )
  , base = require( './base' );

function Qmaker(controller, options ) {

	assert( typeof options !== 'undefined' );
	assert( typeof options.hasOwnProperty( 'workingDir' ) );	
	assert( typeof options.hasOwnProperty( 'buildDir' ) );	

	console.log( path.join( options.buildDir, 'Makefile' ) );

	controller.on( 'generate', function() {
		var emitter = base.makeProcessor({ 
				cmd: '/Users/mbusenitz/Qt5.2.1/5.2.1/clang_64/bin/qmake', 
				args: [ 
					options.defPath,
					'-r',
					'-spec',
					'macx-clang',
					'CONFIG+=debug',
					'CONFIG+=x86_64',
					'CONFIG+=declarative_debug',
					'CONFIG+=qml_debug', 
					'-o', 
					path.join( options.buildDir, 'Makefile' )
				], 
				cwd: options.buildDir 
			});

		emitter.once( 'exit', function( code, signal ) { 
			if (!code) {
				controller.emit( 'build' );
			}
		});

		controller.emit( 'step', 'qmake' ); 
		emitter.emit( 'execute' );
	});

}

module.exports = Qmaker;