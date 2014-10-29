var assert = require( 'assert' )
  , cp = require( 'child_process' )
  , join = require( 'path' ).join;

function Runner(controller, options) {

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'buildDir' ) );

  controller.on( 'run', function( sum ) {

    var path = join( options.buildDir, sum, options.target )
      , child; 

    controller.emit( 'step', 'run', sum );

    cp.exec( 'killall BookWright', function(error, stdout, stderr) {
      cp.spawn( path, options.runOptions, { stdio: 'inherit' } );
    } ); 
  });
}

module.exports = Runner;
