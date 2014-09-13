var Notification = require( 'node-notifier' );

function Notifier( controller ) {

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
			var n = new Notification(); 
			n.notify( { 
				title: currentStep + " failed!", 
				message: "code: "+ code + " signal: " + signal
			}); 
		}
	});
}

module.exports = Notifier; 
