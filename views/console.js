var ansi = require( 'ansi' )
  , cursor = ansi( process.stdout ); 

function Console( controller ) {

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

	controller.emit( 'check', function() {
		cursor.green();
		console.log( 'check' ); 
		cursor.reset();
	});
}

module.exports = Console; 

