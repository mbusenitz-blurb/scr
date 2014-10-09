#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , path = require( 'path' )
  , Notifier = require( './views/notifier' )
  , Console = require( './views/console' )
  , Generator = require( './generator' )
  , Qmaker = require( './qmaker' )
  , Maker = require( './maker' )
  , Runner = require( './runner' )
  , Configuration = require( './configuration' )
  , program = require( 'commander' )
  , config = require( './config.json' ); 

var controller = new events.EventEmitter()
  , config = new Configuration(controller, config);

program.version( '0.0.1' )
	.option( '-b --build', 'only build' )
  .option( '-q --qmake', 'force qmake' )
  .option( '-t --test', 'test target' )
  .parse( process.argv );

if (program.test) {
  config.qmakeOptions += ",CONFIG+=testmake";
  config.target = "TestBookWright.app/Contents/MacOS/TestBookWright";
  config.test = program.test;
}
else {
  config.target = "BookWright.app/Contents/MacOS/BookWright";
}

config.forceQmake = program.qmake;

var generator = new Generator( controller, config )
  , consView = new Console( controller )
  , notifer = new Notifier( controller )
  , qmaker = new Qmaker( controller, config )
  , maker = new Maker( controller, config ); 

if (!program.build) {
  var runner = new Runner( controller, config );
}

controller.emit( 'check' );
