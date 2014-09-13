var Notification = require( 'node-notifier' );

function Notifier( controller ) {

	var instance = this
	  , currentStep = 'none'; 
	  
	controller.on( 'qmake', function() {
		currentStep = 'qmake';
	}); 
	
	controller.on( 'make', function() {
		currentStep = 'make';
	}); 
	
	controller.on( 'run', function() {
		currentStep = 'run';
	}); 

	controller.emit( 'check', function() {
		currentStep = 'check';
	});

	controller.on( 'exit', function(code, signal) {
		if (code) {
			instance.notify({
				title: currentStep + " failed!", 
				message: "code: " + code + " signal: " + signal
			}); 
		}
	});
}

Notifier.prototype.notify = function( o ) {
	var n = new Notification(); 
	n.notify( o ); 
}; 

module.exports = Notifier; 
