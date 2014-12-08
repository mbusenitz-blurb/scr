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

    var child = cp.spawn(
      'make',
      [ '-j', '8' ],
      { cwd: path.join( options.buildDir, sum ) }
    );

    controller.emit( 'step', 'make', sum );

    child.on( 'exit', function( code, signal ) {
      if (!code) {
        controller.emit( 'run', sum );
      }
      else {
        process.exit( code );
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
