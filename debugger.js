var assert = require( 'assert' )
  , cp = require( 'child_process' )
  , join = require( 'path' ).join
  , as = require( 'applescript' );

function Debugger(controller, options) {

  assert( typeof options !== 'undefined' );

  controller.on( 'build', function() { 
    var detachScript = 
      'tell application "Xcode"\n' +
      'activate\n' +
      'end tell\n' +
      'tell application "System Events"\n' + 
        'tell process "Xcode"\n' + 
          'click menu item "Detach" of menu "Debug" of menu bar 1\n' +
        'end tell\n' +
      'end tell';
      as.execString( detachScript, function( error, result ) {
        if (error) {
          console.log( error ); 
        }
      } );
  } );

  controller.on( 'launched', function( sum ) {
    cp.exec( 'open ' + join( options.buildDir, sum, options.xcodeProject ), function(error, stdout, stderr) {
      var runScript =
        'tell application "Xcode"\n' +
          'activate\n' +
          'tell application "System Events"\n' +
            'perform (key code 111)\n' +
            'perform (keystroke "' + options.targetName + '")\n' +
            'delay 1\n' + 
            'perform (key code 36)\n' +
         'end tell\n' +
         'end tell\n';

      as.execString( runScript, function(error, result) {
            if (error) {
              console.log( error );
            }
            var backScript = 'tell application "Sublime Text 2"\nactivate\nend tell';
            as.execString( backScript, function() {} );
          } );
    } );     
  } );
}

module.exports = Debugger;
