var ansi = require( 'ansi' )
  , cursor = ansi( process.stdout ); 

function Console( controller ) {

	controller.on( 'step', function(step) {
		cursor.green();
		console.log( step ); 
		cursor.reset();
	}); 
}

module.exports = Console; 

