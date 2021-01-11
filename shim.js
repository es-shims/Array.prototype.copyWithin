'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayCopyWithin() {
	var polyfill = getPolyfill();
	define(
		Array.prototype,
		{ copyWithin: polyfill },
		{ copyWithin: function () { return Array.prototype.copyWithin !== polyfill; } }
	);
	return polyfill;
};
