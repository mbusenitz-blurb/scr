#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , Notifier = require( './views/notifier' )
  , Console = require( './views/console' )
  , Generator = require( './generator' )
  , Qmaker = require( './qmaker' )
  , Maker = require( './maker' )
  , Runner = require( './runner' )
  , program = require( 'commander' );

program.version( '0.0.0' )
	.option( '-t --test [match]', 'test matching cases' )
	.parse( process.argv );

var options = {
	defPath: '/data/repositories/native_booksmart/Bookwright.pro', 
	buildDir: '/data/repositories/native_booksmart_test/', 
	sumFile: '.shasum', 
	workingDir: '/data/repositories/native_booksmart/'
};

if (program.test) {
	options.test = program.test;
}

var controller = new events.EventEmitter()
  , generator = new Generator( controller, options )
  , consView = new Console( controller )
  , notifer = new Notifier( controller )
  , qmaker = new Qmaker( controller, options )
  , maker = new Maker( controller, options )
  , runner = new Runner( controller, options ); 

controller.emit( 'check' );