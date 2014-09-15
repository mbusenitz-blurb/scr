var chai = require( 'chai' )
	, events = require( 'events' )
	, assert = chai.assert
	, expect = chai.expect;  

suite( 'generator', function() {

	var Generator = require( '../generator' ); 

	test( 'require path', function() {
		assert( typeof Generator === 'function' ); 
	} );
} ); 