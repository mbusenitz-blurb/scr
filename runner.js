var assert = require( 'assert' )
  , cp = require( 'child_process' )
  , prompt = require( 'prompt' )
  , http = require( 'http' )
  , socketio = require( 'socket.io' )
  , join = require( 'path' ).join;

function Runner(controller, options) {

  var server;

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'buildDir' ) );

  if (options.redirect) {
    server = http.createServer( function( req, res ) {
        //console.log( req );
        res.end( 'done' );
    } ).listen( '3001' );
  }

  controller.on( 'run', function( sum ) {
    var connection;
    if (options.redirect) {
      io = socketio.listen( server );
      io.sockets.on( 'connection', function( socket ) {
        connection = socket;
      } );
    }

    console.log( options );

    var path = join( options.buildDir, sum, options.target );

    controller.emit( 'step', 'run', sum );

    cp.exec( 'killall BookWright', function(error, stdout, stderr) {
      var child = cp.spawn( path, options.runOptions,
        { stdio: 'inherit'
          //[ process.stdin, process.stdout, 'pipe' ]
        } );
      child.on( 'exit', function(code,signal) {
        if (code) {
          process.exit( code );
          console.log( 'exited with status: ', code, signal );
        }
        else {
          console.log( 'exited without error' );
        }
      });
    }); 
  });
}

module.exports = Runner;
