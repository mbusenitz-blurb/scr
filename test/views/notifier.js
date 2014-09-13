var assert = require( 'chai' ).assert
  , events = require( 'events' ); 

suite( 'notifier', function() {

	var Notifier = require( '../../views/notifier' ); 

	test( 'require path', function() {
		assert( typeof Notifier === 'function' );
	});

	test( 'notify method', function() {
		assert( Notifier.prototype.hasOwnProperty( 'notify' ) ); 
	}); 

	test( 'invoke on exit with code', function() {
		var e = new events.EventEmitter()
		  , n = new Notifier(e)
		  , hitCount = 0;

		n.notify = function() {
			++hitCount;
		}; 

		e.emit( 'exit', { code: 1, signal: '' } ); 
		assert( hitCount >= 1 );
	});

});
