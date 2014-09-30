var assert = require( 'assert' )
  , cp = require( 'child_process' )
  , join = require( 'path' ).join;

function Runner(controller, options) {

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'buildDir' ) );

  controller.on( 'run', function() {

    var path = join( options.buildDir, options.target );
    controller.emit( 'step', 'run' );
    cp.spawn( path, options.runOptions, { stdio: 'inherit' } );
  });
}

module.exports = Runner;
