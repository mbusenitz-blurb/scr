#!/usr/bin/env node

var bufferError = ''
  , bufferOk = ''
  , errRegex = new RegExp( ".*error:.* ../native_booksmart/" )
  , fileRegex = new RegExp( ".* ../native_booksmart/(.*)" );

function onOk(data) {
	var matches;
	bufferOk += data.toString();
	matches = bufferOk.match( fileRegex );
	if (matches) {
		process.stdout.write( matches[1] + '\n' );
		bufferOk = bufferOk.replace( fileRegex, '' );
	}
}

function onError(data) {
	var matches;
	bufferError += data.toString();
	matches = bufferError.match( errRegex );
	if (matches) {
		matches.forEach( function( match ) {
			match = replace( '../native_booksmart/', '' );
			process.stdout.write( match + '\n' );
		} );
		bufferError = bufferError.replace( errRegex, '' );
	}
}

module.exports.onOk = onOk;
module.exports.onError = onError;
