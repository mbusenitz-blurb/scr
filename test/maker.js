var chai = require( 'chai' )
	, events = require( 'events' )
	, assert = chai.assert
	, expect = chai.expect;  

suite( 'maker', function() {

	var Maker = require( '../maker' ); 

	test( 'require path', function() {
		assert( typeof Maker === 'function' ); 
	} );

} ); 