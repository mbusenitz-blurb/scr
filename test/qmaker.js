var chai = require( 'chai' )
	, events = require( 'events' )
	, assert = chai.assert
	, expect = chai.expect;  

suite( 'qmaker', function() {

	var Qmaker = require( '../qmaker' ); 

	test( 'require path', function() {
		assert( typeof Qmaker === 'function' ); 
	} );
} ); 