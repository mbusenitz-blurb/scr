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

program.version( '0.0.0' )
	.option( '-b --build', 'only build' )
  .option( '-r --run', 'only run target' )
  .parse( process.argv );

if (program.test) {
	config.test = program.test;
}

if (program.build) {
  var generator = new Generator( controller, config )
    , consView = new Console( controller )
    , notifer = new Notifier( controller )
    , qmaker = new Qmaker( controller, config )
    , maker = new Maker( controller, config ); 

  controller.emit( 'check' );
}
else if (program.run) {
  var generator = new Generator( controller, config )
    , consView = new Console( controller )
    , notifer = new Notifier( controller )
    , runner = new Runner( controller, config ); 

  controller.on( 'build', function( sum ) {
    controller.emit( 'run', sum );
  } );

  controller.emit( 'check' );
}
else {
  var generator = new Generator( controller, config )
    , consView = new Console( controller )
    , notifer = new Notifier( controller )
    , qmaker = new Qmaker( controller, config )
    , maker = new Maker( controller, config )
    , runner = new Runner( controller, config ); 

  controller.emit( 'check' );
}
