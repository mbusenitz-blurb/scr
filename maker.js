#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , printer = require( './print.js' )
  , base = require( './base' );

function Maker(controller, options) {

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'buildDir' ) ); 

  controller.on( 'build', function() {
    var emitter = base.makeProcessor({ 
        cmd: 'make', 
        args: [ '-j', '8' ], 
        cwd: options.buildDir
      }, printer );

    emitter.on( 'exit', function( code, signal ) { 
      if (!code) {
        controller.emit( 'run' ); 
      }
    });
    controller.emit( 'step', 'make' );
    emitter.emit( 'execute' ); 
  });
}

module.exports = Maker;
