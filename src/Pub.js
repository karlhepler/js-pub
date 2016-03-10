var pather = require('./helpers/pather.js');
var globaler = require('./helpers/globaler.js');
var extend = require('extend');

var Pub = function Pub(paths, base) {
	// These are the private properties
	var props = {
		paths: {},
		base: pather.finalize(base || '')
	};

	// This is the API we're returning
	var api = {
		path: path,
		addPath: addPath
	};
	
	// Call the add Path method,
	// passing in _paths or a default.
	// Only relavent if _paths is defined.
	addPath(paths || {});

	/**
	 * Return a fully-qualified path
	 *
	 * @param {string} p
	 * @returns {string}
	 */
	function path(p) {
		return pather.finalize(
			props.base + pather.normalize(p || '')
		);
	};

	/**
	 * Add a path to Pub
	 *
	 * @param {string|object} key
	 * @param {string} value
	 * @return {void}
	 */
	function addPath(key, value) {
		// Initialize value with a default
		value = value || '';
	
		// If key is NOT an object, then add to api
		if ( typeof key !== 'object' ) {
			// Get the method name and base path
			var methodName = pather.camelCase(key);
			var basePath = pather.normalize(value);
			
			// Create the path object
			var path = {};
			path[methodName] = basePath;

			// Extend props.paths with path
			props.paths = extend({}, props.paths, path);

			// Add the method to the api & return void
			addToApi(methodName, basePath);
			return;
		}
		
		// The value IS an object, so recurse!
		for ( var index in key ) {
			addPath(index, key[index]);
		}
	};

	/**
	 * Add a new path method to the API
	 *
	 * @param {string} methodName
	 * @param {string} basePath
	 * @returns {void}
	 */
	function addToApi(methodName, basePath) {
		api[methodName] = function(path) {
			return build(basePath, path || '');
		};
	}

	/**
	 * Build a fully-qualified path,
	 * given the base and the path
	 *
	 * @param {string} base
	 * @param {string} path
	 * @returns {string}
	 */
	function build(base, newPath) {
		return path(
			base + pather.normalize(newPath)
		);
	}

	// Return the api!
	return api;
}

/**
 * This is the main entry point for the js class.
 * It sets up Pub and adds its methods to the global scope.
 *
 * @param {string} base
 * @param {object} functionPaths
 * @return {Pub}
 */
Pub.globalize = function globalize(functionPaths, base) {
	functionPaths = functionPaths || {};

	// Captcher a new instance of Pub
	var pub = globaler.capture('Pub', new Pub(functionPaths, base), 'path');

	// Create global functions
	// for each function name in the function paths array
	for ( var functionName in functionPaths ) {
		globaler.addFunction(functionName, 'Pub', functionName);
	}

	// Return globaler.instances()['Pub']
	return pub;
};

// Export the module!
module.exports = Pub;
