#!/usr/bin/env node

var assert = require( 'assert' )
  , path = require( 'path' ); 

function Configuration(commander, config) {
  var instance = this;

  assert( config.hasOwnProperty( 'defPath' ) ); 
  assert( config.hasOwnProperty( 'qmakeOptions' ) );
  assert( config.hasOwnProperty( 'qmakePath' ) );

  this.defPath = path.join( __dirname, config.defPath );
  this.qmakeOptions = config.qmakeOptions;
  this.qmakePath = config.qmakePath;

  this.workingDir = path.dirname( this.defPath );
  
  if (config.hasOwnProperty('buildDir')) {
    this.buildDir = path.join( __dirname, config.buildDir ); 
  }
  else {
    this.buildDir = path.resolve( 
      this.workingDir, 
      path.join( '../', path.basename( this.workingDir ) + '_build' ) 
    );
  }

  if (config.hasOwnProperty('runOptions')) {
    this.runOptions = config.runOptions;
  }
  else {
    this.runOptions = [];
  }
}

module.exports = Configuration;
