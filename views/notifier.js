var notifier = require( 'node-notifier' );

function Notifier( controller ) {

	var instance = this
	  , current = 'none'; 

	controller.on( 'step', function(step) {
		current = step;
	}); 

	controller.on( 'build error', function(msg) {
		instance.notify({
			title: current + " failed!", 
			message: msg
		}); 
	});

	controller.on( 'assert failed', function(msg) {
		instance.notify({
			title: "assert failed!", 
			message: msg
		}); 
	});
	
	controller.on( 'exit', function(code, signal) {
		if (code) {
			instance.notify({
				title: current + " failed!", 
				message: "code: " + code + " signal: " + signal
			}); 
		}
	});
}

Notifier.prototype.notify = function(o) {
	notifier.notify( o );
};

module.exports = Notifier; 
