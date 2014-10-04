#!/usr/bin/env node

var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' )
  , crypto = require( 'crypto' )
  , join = require( 'path' ).join
  , base = require( './base' );


function Generator(controller, options) {

  var sumPath; 

  assert( typeof options !== 'undefined' );
  assert( options.hasOwnProperty( 'defPath' ) ); 
  assert( options.hasOwnProperty( 'buildDir' ) ); 
  assert( options.hasOwnProperty( 'sumFile' ) );

  sumPath = join( options.buildDir, options.sumFile ); 

  controller.on( 'generate', function(sum) {
    fs.writeFile( sumPath, sum, function(err) {
      if (err) throw err;
    } );
  });

  controller.on( 'check', function() {
    controller.emit( 'step', 'check' ); 

    fs.readFile( options.defPath, function( err, defData) {
      
      if (err) throw err;
      else {
        
        var sum = calcSum(defData, options.qmakeOptions )
          , fullBuilDir = path.join( options.buildDir, sum );

        fs.exists( options.buildDir, function( exists ) {
          if (!exists) {
            fs.mkdir( options.buildDir, function() {
              fs.mkdir( fullBuilDir, function() {
                controller.emit( 'generate', sum );
              } );
            } );
          }
          else {
            fs.exists( fullBuilDir, function( exists ) {
              if (!exists) {
                fs.mkdir( fullBuilDir, function() {
                  controller.emit( 'generate', sum );
                } );
              }
              else {
                controller.emit( 'build', sum );
              }
            } );
          }
        } ); 

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