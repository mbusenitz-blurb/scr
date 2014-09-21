#!/usr/bin/env node

var assert = require( 'assert' )
  , fs = require( 'fs' )
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
        
        var sum = crypto
          .createHash('sha1')
          .update(defData)
          .digest('hex');

        fs.exists( options.buildDir, function( exists ) {
          if (!exists) {
            fs.mkdir( options.buildDir, function() {
              controller.emit( 'generate', sum );
            }); 
          }
          else {
            fs.readFile( sumPath, function( err, sumData ) {
              var equals = !err && sumData.toString() == sum;
              controller.emit( equals ? 'build' : 'generate', sum );
            });    
          }
        }); 
      }
    });
  }); 
}

module.exports = Generator;