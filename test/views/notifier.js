var chai = require( 'chai' )
	, events = require( 'events' )
	, assert = chai.assert
	, expect = chai.expect;  

suite( 'notifier', function() {

	var Notifier = require( '../../views/notifier' ); 

	test( 'require path', function() {
		assert( typeof Notifier === 'function' );
	});

	test( 'notify method', function() {
		assert( Notifier.prototype.hasOwnProperty( 'notify' ) ); 
	}); 

	test( 'invoke on exit with code != 0', function() {
		var h = makeHarness();
		h.controller.emit( 'exit', 1, '' ); 
		assert( h.hitCount == 1 );
	});

	test( "not invoke on exit with code == 0", function() {
		var h = makeHarness();
		h.controller.emit( 'exit', 0, '' ); 
		assert( h.hitCount == 0 );
	});

	test( "track latest step", function() {
		var h = makeHarness( function(o) { 
			assert( o.hasOwnProperty( 'title' ) ); 
			assert( o.title.indexOf( 'make' ) != -1 ); 
		});
		
		h.controller.emit( 'step', 'make' ); 
		h.controller.emit( 'exit', 1, '' ); 
		assert( h.hitCount == 1 );
	});

	function makeHarness(cb) {
		var result = { 
					controller: new events.EventEmitter(), 
					hitCount: 0 
				}
  		, n = new Notifier(result.controller); 
		
		n.notify = function(o) {
			++result.hitCount;
			if (typeof cb !== 'undefined') {
				cb( o ); 
			}
		};

		return result;
	}
});
