var ansi = require( 'ansi' )
  , cursor = ansi( process.stdout ); 

var Console = function( controller ) {

	controller.on( 'qmake', function() {
		cursor.green();
		console.log( 'qmake' ); 
		cursor.reset();
	}); 
	
	controller.on( 'make', function() {
		cursor.green();
		console.log( 'make' ); 
		cursor.reset();
	}); 
	
	controller.on( 'run', function() {
		cursor.green();
		console.log( 'run' ); 
		cursor.reset();
	}); 
}

module.exports = Console; 

