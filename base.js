var assert = require( 'assert' )
  , events = require( 'events' )
  , Processor = require( 'mucbuc-jsthree' ).Processor
  , defaultPrinter = {
  		onOk: print,
  		onError: print
  	};

assert( typeof Processor !== 'undefined' );

function print(data) {
	process.stdout.write( data.toString() );
}

function makeProcessor(map, printer) {
	var emitter = new events.EventEmitter()
	p = new Processor(map, emitter);

	if (typeof printer === 'undefined' )
		printer = defaultPrinter;

	emitter.on( 'stdout', printer.onOk );
	emitter.on( 'stderr', printer.onError );

	return emitter;
}

module.exports.makeProcessor = makeProcessor;
