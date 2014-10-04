var ansi = require( 'ansi' )
  , cursor = ansi( process.stdout ); 

function Console( controller ) {
	var prev; 

	process.on( 'exit', function() {
		if(prev) {
			cursor.green();
			console.timeEnd( prev );
			cursor.reset();
		}
	});

	controller.on( 'step', function(step) {
		cursor.green();
		if(prev) 
			console.timeEnd( prev );
		console.log( step );
		console.time( step );
		cursor.reset();
		prev = step;
	}); 

	controller.on( 'generate', function( sum ) {
		cursor.green();
		console.log( 'generate ' + sum ); 
		cursor.reset();
	}); 

	controller.on( 'build', function( sum ) {
		cursor.green();
		console.log( 'build ' + sum ); 
		cursor.reset();
	}); 
}

module.exports = Console; 

