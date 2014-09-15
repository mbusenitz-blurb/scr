#!/usr/bin/env node

var assert = require( 'assert' )
  , base = require( './base' );

function Qmaker(controller, options ) {

	assert( typeof options !== 'undefined' );
	assert( typeof options.hasOwnProperty( 'workingDir' ) );	

	controller.on( 'generate', function() {
		var emitter = base.makeProcessor({ 
				cmd: '/Users/mbusenitz/Qt5.2.1/5.2.1/clang_64/bin/qmake', 
				args: [ 
					'/data/repositories/native_booksmart/Bookwright.pro',
					'-r',
					'-spec',
					'macx-clang',
					'CONFIG+=debug',
					'CONFIG+=x86_64',
					'CONFIG+=declarative_debug',
					'CONFIG+=qml_debug', 
					'CONFIG+=testmake',
					'-o', 
					'/data/repositories/native_booksmart_test/Makefile'
				], 
				cwd: options.workingDir 
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