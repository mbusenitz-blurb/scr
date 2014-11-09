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
    cp.exec( 'killall ' + options.targetName, function(error, stdout, stderr) {
      
      console.log( 'launched' );
      controller.emit( 'launched', sum );

      var child;
      if (options.autodump) {
        child = cp.spawn( path, options.runOptions, { stdio: 'inherit' } ); 
      }
      else {
        var output = '';  
        
        child = cp.spawn( path, options.runOptions, { stdio: 'pipe' } )
        child.stdout.on( 'data', function( data ) { 
          output += data.toString();
          if (connection) {
            connection.emit( 'data', data );
          }
        } ); 

        child.stderr.on( 'data', function( data ) { 
          output += data.toString();
          if (connection) {
            connection.emit( 'data', data );
          }
        } );

        prompt.start();
        read();
        function read() {
          prompt.get( ['command'], function( err, result ) {
            if (err) 
              console.log( err );
            if (result.command === 'pipe') {
              prompt.get( [ 'input' ], function( err, result ) {
                child.stdin.write( result.input + '\n' );
                read();
              });
            }
            else if (result.command === 'dump') {
              process.stdout.write( output );
              output = '';
              read();
            }
          });
        }
      }
    } );
  });
}

module.exports = Runner;
