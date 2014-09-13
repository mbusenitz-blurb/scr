var ansi = require( 'ansi' )
  , cursor = ansi( process.stdout ); 

var Console = function( controller ) {

	controller.on( 'qmake', function() {
		cursor.green();
		console.log( 'qmake' ); 
		cursor.reset();
	}); 
	
	controller.on( 'make', function() {
		console.log( 'make' ); 
	}); 
	
	controller.on( 'run', function() {
		console.log( 'run' ); 
	}); 
}

module.exports = Console; 

