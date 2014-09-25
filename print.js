#!/usr/bin/env node

var bufferError = ''
  , bufferOk = ''
  , relative = '.*/native_booksmart/'
  , errRegex = new RegExp( ".*error:.*" )
  , fileRegex = new RegExp( ".* " + relative + "(.*)" );

function onOk(data) {
	bufferOk += data.toString();

	bufferOk
		.split( '\n' )
		.forEach( function( line ) {
			bufferOk = bufferOk.substr( line.length + 1 ); 
			var words = line.split( ' ' ); 
			if (words) {
				var word = words[words.length - 1].trim(); 
				if (word.length) {
					var matches = word.match( '.*\/(.*)' ); 
					if (matches) {
						process.stdout.write( matches[1] + '\n' );
					}
					else {
						process.stdout.write( word + '\n' );
					}
				}
			}
		} );
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
