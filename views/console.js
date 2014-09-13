var Console = function( controller ) {
	controller.on( 'qmake', function() {
		console.log( 'qmake' ); 
	}); 
	
	controller.on( 'make', function() {
		console.log( 'make' ); 
	}); 
	
	controller.on( 'run', function() {
		console.log( 'run' ); 
	}); 
}

module.exports = Console; 

