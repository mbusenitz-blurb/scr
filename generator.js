#!/usr/bin/env node

var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' )
  , crypto = require( 'crypto' )
  , join = require( 'path' ).join;

function Generator(controller, options) {

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'defPath' ) );
  assert( options.hasOwnProperty( 'buildDir' ) );

  controller.on( 'check', function() {
    controller.emit( 'step', 'check' );

    fs.readFile( options.defPath, function( err, defData) {
      if (err) {
        controller.emit( 'exit', err.errno, err.code );
        console.log( err );
      }
      else {

        var sum = calcSum(defData, options.qmakeOptions );

        if (options.forceQmake) {
          controller.emit( 'generate', sum );
        }
        else {
          var fullBuildDir = path.join( options.buildDir, sum );

          fs.exists( options.buildDir, function( exists ) {
            if (!exists) {
              fs.mkdir( options.buildDir, function() {
                fs.mkdir( fullBuildDir, function() {
                  controller.emit( 'generate', sum );
                } );
              } );
            }
            else {
              fs.exists( fullBuildDir, function( exists ) {
                if (!exists) {
                  fs.mkdir( fullBuildDir, function() {
                    controller.emit( 'generate', sum );
                  } );
                }
                else {
                  var makeFile = path.join( fullBuildDir, options.xcode ? options.xcodeProject : 'Makefile' );
                  fs.exists( makeFile, function(exists) {
                    controller.emit( exists ? 'build' : 'generate', sum );
                  });
                }
              } );
            }
          } );
        }

        function calcSum(defData, qmakeOptions) {
          var sum = crypto
            .createHash('sha1')
            .update(defData)
            .update(qmakeOptions.toString())
            .digest('hex');
          return sum;
        }
      }
    });
  });
}

module.exports = Generator;
