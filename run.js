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
  , Debugger = require( './debugger' )
  , Configuration = require( './configuration' )
  , program = require( 'commander' )
  , config = require( './config.json' );

var controller = new events.EventEmitter()
  , config = new Configuration(controller, config);

program.version( '0.0.1' )
	.option( '-b --build', 'only build' )
  .option( '-q --qmake', 'force qmake' )
  .option( '-t --test', 'test target' )
  .option( '-x --xcode', 'xode target' )
  .option( '-a --autodump', 'show continous output' )
  .option( '-r --redirect [port]', 'send output to port')
  .parse( process.argv );

config.xcode = program.xcode ? true : false;

config.targetName = program.test ? "TestBookWright" : "BookWright";
config.target = config.targetName + ".app/Contents/MacOS/" + config.targetName;

if (config.xcode) {
    config.xcodeProject = config.targetName + '.xcodeproj'
    //config.target = "Debug/" + config.target;
}

if (program.test) {
  config.qmakeOptions.push( "CONFIG+=testmake" );
  config.test = program.test;
}

config.forceQmake = program.qmake;

config.qmakeOptions.splice( 1, 0, "-spec" );    
if (config.xcode) {
  config.qmakeOptions.splice( 2, 0, "macx-xcode" ); 
}
else {
  config.qmakeOptions.splice( 2, 0, "macx-clang" ); 
}

config.autodump = program.autodump;
config.redirect = program.redirect;

var generator = new Generator( controller, config )
  , consView = new Console( controller )
  , notifer = new Notifier( controller )
  , qmaker = new Qmaker( controller, config )
  , maker = new Maker( controller, config );

if (!program.build) {
  var runner = new Runner( controller, config );

  if (config.xcode) {
    var dbger = new Debugger( controller, config );
  }
}



controller.emit( 'check' );
