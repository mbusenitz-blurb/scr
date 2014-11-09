#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , path = require( 'path' )
  , printer = require( './print.js' )
  , cp = require( 'child_process' );

function Maker(controller, options) {

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'buildDir' ) );

  controller.on( 'build', function( sum ) {

    var child
      , args = { 
          cwd: path.join( options.buildDir, sum )
      }; 

    if (options.xcode)
    {
      child = cp.spawn(
        'xcodebuild',
        [ '-project', options.xcodeProject ],
        args
      );
    }
    else
    {
      console.log( '****', args );

      child = cp.spawn( 
        'make', 
        [ '-j', '8' ],
        args
      );

      console.log( '****', args ); 
    }

    controller.emit( 'step', 'make', sum );

    child.on( 'exit', function( code, signal ) {
      if (!code) {
        controller.emit( 'run', sum );
      }
    } );

    child.stdout.on( 'data', printer.onOk );
    child.stderr.on( 'data', function(data) {
      controller.emit( 'build error', data.toString() );
      //child.kill( 'SIGCHLD' );
    });
  });
}

module.exports = Maker;
