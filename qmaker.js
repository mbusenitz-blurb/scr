#!/usr/bin/env node

var assert = require( 'assert' )
  , path = require( 'path' )
  , cp = require( 'child_process' );

function Qmaker(controller, options ) {

	assert( typeof options !== 'undefined' );
	assert( typeof options.hasOwnProperty( 'workingDir' ) );	
	assert( typeof options.hasOwnProperty( 'buildDir' ) );	

	controller.on( 'generate', function( sum ) {
		
		var qmake = path.join( options.qmakePath, 'qmake' );

		cp.exec( qmake + ' -v', function(error, stdout, stderr) {
			if (error) {
				throw error;
			}
			else {
				var args = []
		 		  , child;

				controller.emit( 'step', 'generate', sum, stdout ); 

				args.push( options.defPath ); 
				args = args.concat( options.qmakeOptions );
				args = args.concat( '-o', path.join( options.buildDir, sum, 'Makefile' ) ); 

				child = cp.spawn( 
					qmake, 
					args, 
					{ 
					  cwd: options.buildDir, 
					  stdio: 'inherit'
					} 
				);

				child.on( 'exit', function( code, signal ) {
					if (!code) {
						controller.emit( 'build', sum );
					}
					else {
						controller.emit( 'exit', code, signal ); 
					}
				});
			}
		} );
	});

}

module.exports = Qmaker;