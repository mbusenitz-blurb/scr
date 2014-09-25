#!/usr/bin/env node

var assert = require( 'assert' )
  , path = require( 'path' ); 

function Configuration(commander, config) {
  var instance = this;

  assert( config.hasOwnProperty( 'defPath' ) ); 
  assert( config.hasOwnProperty( 'target' ) ); 
  assert( config.hasOwnProperty( 'qmakeOptions' ) ); 

  this.defPath = config.defPath,
  this.target = config.target;
  this.qmakeOptions = config.qmakeOptions;

  this.workingDir = path.dirname( this.defPath );
  
  if (config.hasOwnProperty('buildDir')) {
    this.buildDir = config.buildDir; 
  }
  else {
    this.buildDir = path.resolve( 
      this.workingDir, 
      path.join( '../', path.basename( this.workingDir ) + '_build' ) 
    );
  }

  if (config.hasOwnProperty('sumFile')) {
    this.sumFile = config.sumFile;
  }
  else {
    this.sumFile = '.shasum'; 
  }

  if (config.hasOwnProperty('runOptions')) {
    this.runOptions = config.runOptions;
  }
  else {
    this.runOptions = [];
  }
}

module.exports = Configuration;
