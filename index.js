'use strict';

var callBind = require('call-bind');
var callBound = require('call-bound');
var define = require('define-properties');
var RequireObjectCoercible = require('es-object-atoms/RequireObjectCoercible');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var $slice = callBound('Array.prototype.slice');

var bound = callBind.apply(getPolyfill());
var boundCopyWithin = function copyWithin(array) {
	RequireObjectCoercible(array);
	return bound(array, $slice(arguments, 1));
};

define(boundCopyWithin, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundCopyWithin;
