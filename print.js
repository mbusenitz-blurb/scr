#!/usr/bin/env node

var bufferError = ''
  , bufferOk = ''
  , relative = '../native_booksmart/'
  , errRegex = new RegExp( ".*error:.*" )
  , fileRegex = new RegExp( ".* " + relative + "(.*)" );

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
			match = match.replace( relative, '' );
			process.stdout.write( match + '\n' );
		} );
		bufferError = bufferError.replace( errRegex, '' );
	}
}

module.exports.onOk = onOk;
module.exports.onError = onError;
