/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'dist/app',
      rxjs: 'npm:rxjs',
      underscore: 'npm:underscore',
      faker: 'npm:faker',
      extend: 'npm:extend',
      request: 'npm:request',
      'rx-http-request': 'npm:rx-http-request',
      'rx-http-request/lib': 'npm:rx-http-request/lib'
		},
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
			dist: {
				main: './index.js',
				defaultExtension: 'js'
			},
      rxjs: {
        main: './Rx.js',
				defaultExtension: 'js'
      },
      underscore: {
        main: './underscore-min.js'
      },
      extend: {
          main: './index.js',
          defaultExtension: 'js'
      },
      'rx-http-request': {
          main: './index.js',
          defaultExtension: 'js'
      },
      'rx-http-request/lib': {
          main: './index.js',
          defaultExtension: 'js'
      },
      request: {
          main: './index.js',
          defaultExtension: 'js'
      }
		}    
  });
})(this);
