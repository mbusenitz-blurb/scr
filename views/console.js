var ansi = require( 'ansi' )
  , cursor = ansi( process.stdout )
  , inspect = require( 'util' ).inspect;

function Console( controller ) {
	var prev; 

	process.on( 'exit', function() {
		if(prev) {
			cursor.green();
			console.timeEnd( prev );
			cursor.reset();
		}
	});

	controller.on( 'build error', function(msg) {
		cursor.red(); 
		console.log( msg ); 
		cursor.reset();
	});

	controller.on( 'assert failed', function(msg) {
		cursor.red(); 
		console.log( 'assert failed!', msg ); 
		cursor.reset();
	});

	controller.on( 'step', function(step) {
		cursor.green();
		if(prev) 
		{
			console.timeEnd( prev );
			console.log( '' );
		}
		console.time( step );
		for (var i = 0; i < arguments.length; ++i) {
			console.log( arguments[i].trim() );
		}
		cursor.reset();
		prev = step;
	}); 
}

module.exports = Console; 

