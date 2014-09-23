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
  , program = require( 'commander' );

program.version( '0.0.0' )
	.option( '-t --test [match]', 'test matching cases' )
  .option( '-q --qmake', 'only run qmake' )
  .option( '-m --make', 'only run make' )
  .parse( process.argv );

function Configuration() {
  var instance = this;

  this.defPath = '/Users/mbusenitz/work/native_booksmart/Bookwright.pro',

  this.workingDir = path.dirname( this.defPath );

  this.buildDir = '/data/repositories/native_booksmart_build'; 

  this.sumFile = '.shasum';

  this.target = 'TestBookWright.app/Contents/MacOS/TestBookWright';
}

var config = new Configuration();

if (program.test) {
	config.test = program.test;
}

if (program.qmake) {
  var controller = new events.EventEmitter()
    , generator = new Generator( controller, config )
    , consView = new Console( controller )
    , notifer = new Notifier( controller )
    , qmaker = new Qmaker( controller, config ); 

  controller.emit( 'check' );
}
else if (program.make) {
  var controller = new events.EventEmitter()
    , generator = new Generator( controller, config )
    , consView = new Console( controller )
    , notifer = new Notifier( controller )
    , maker = new Maker( controller, config ); 

  controller.emit( 'build' );
}
else {

  var controller = new events.EventEmitter()
    , generator = new Generator( controller, config )
    , consView = new Console( controller )
    , notifer = new Notifier( controller )
    , qmaker = new Qmaker( controller, config )
    , maker = new Maker( controller, config )
    , runner = new Runner( controller, config ); 

  controller.emit( 'check' );
}
