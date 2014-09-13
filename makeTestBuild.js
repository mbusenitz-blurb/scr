#!/usr/bin/env node

var events = require( 'events' )
  , Processor = require( 'mucbuc-jsthree' ).Processor
  , fs = require( 'fs' )
  , crypto = require( 'crypto' )
  , Notification = require( 'node-notifier' )
  , join = require( 'path' ).join
  , currentStep = 'none'
  , Console = require( './views/console' )
  , printer = require( './print.js' )
  , defaultPrinter = { 
  		onOk: print, 
  		onError: print
  }; 

var controller = new events.EventEmitter()
  , consView = new Console( controller ); 


function print(data) {
	process.stdout.write( data.toString() ); 
}

checkProjectSum( '/data/repositories/native_booksmart/' );

function checkProjectSum(cwd) {

	fs.readFile( '/data/repositories/native_booksmart/Bookwright.pro', function( err, data) {

		var shasum = crypto.createHash('sha1')
	    , sum;

    shasum.update(data);
    sum = shasum.digest('hex');

    fs.readFile( '/data/repositories/native_booksmart_test/.shasum', function( err_sum, data ) {
      if (    err_sum
          ||  data.toString() != sum) {
      		makeTestBuild(cwd);
      		fs.writeFile( '/data/repositories/native_booksmart_test/.shasum', sum );
      }
      else {
      	runMake( cwd, function() {
					runTest( '/data/repositories/native_booksmart_test' ); 
				}); 
      }
		}); 
  }); 
}

function makeTestBuild(cwd) {
	
	fs.exists( '/data/repositories/native_booksmart_test/', function( exists ) {
		if (!exists) {
			fs.mkdir('/data/repositories/native_booksmart_test/' ); 
			console.log( 'mkdir /data/repositories/native_booksmart_test/' );
		}

		runQMake( cwd, function() {
			runMake( cwd, function() {
				runTest( '/data/repositories/native_booksmart_test' ); 
			}); 
		});
	}); 
}

function runTest(cwd, cb) {

	var emitter = makeProcessor({
		cmd: './TestBookWright',
		args: ['-t', '*testChunkedUploaderOrientation*'], 
		cwd: '/data/repositories/native_booksmart_test/TestBookWright.app/Contents/MacOS'
	}, cb );

	controller.emit( 'run' ); 

	currentStep = "test";

	emitter.on( 'exit', function(code, signal) {
		var n = new Notification(); 
		n.notify({message: "code: "+ code + " signal: " + signal}); 
	}); 
		
	emitter.emit( 'execute' );  
}

function runMake(cwd, cb) {
	var emitter = makeProcessor({ 
			cmd: 'make', 
			args: [ '-j', '8' ], 
			cwd: '/data/repositories/native_booksmart_test/'
		}, cb, printer );

	currentStep = "make";

	emitter.emit( 'execute' ); 
}

function runQMake(cwd, cb) {
	
	controller.emit( 'qmake' ); 
	
	currentStep = "qmake"; 

	var emitter = makeProcessor({ 
			cmd: '/Users/mbusenitz/Qt5.2.1/5.2.1/clang_64/bin/qmake', 
			args: [ 
				'/data/repositories/native_booksmart/Bookwright.pro',
				'-r',
				'-spec',
				'macx-clang',
				'CONFIG+=debug',
				'CONFIG+=x86_64',
				'CONFIG+=declarative_debug',
				'CONFIG+=qml_debug', 
				'CONFIG+=testmake',
				'-o', 
				'/data/repositories/native_booksmart_test/Makefile'
			], 
			cwd: cwd 
		}, cb );

	emitter.emit( 'execute' );
}

function makeProcessor(map, cb, printer) {
	var emitter = new events.EventEmitter()
	p = new Processor(map, emitter); 
	
	controller.emit( 'make' ); 

	if (typeof printer === 'undefined' )
		printer = defaultPrinter; 

	emitter.on( 'stdout', printer.onOk );
	emitter.on( 'stderr', printer.onError );
	

	if (typeof cb === 'function') {
		emitter.on( 'exit', function(code, signal) {
			if (!code) {
				cb();
			}
			else {
				var n = new Notification(); 
				n.notify({message: currentStep + " failed! code: "+ code + " signal: " + signal}); 
			}
		});
	}

	function print(data) {
		console.log( data.toString() ); 
	}

	return emitter; 
}
