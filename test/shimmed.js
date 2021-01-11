'use strict';

require('../auto');

var test = require('tape');
var defineProperties = require('define-properties');
var callBind = require('call-bind');

var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();
var hasStrictMode = require('has-strict-mode')();

var runTests = require('./tests');

test('shimmed', function (t) {
	t.equal(Array.prototype.copyWithin.length, 2, 'Array#copyWithin has a length of 2');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Array.prototype.copyWithin.name, 'copyWithin', 'Array#copyWithin has name "copyWithin"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Array.prototype, 'copyWithin'), 'Array#copyWithin is not enumerable');
		et.end();
	});

	t.test('bad array/this value', { skip: !hasStrictMode }, function (st) {
		st['throws'](function () { return Array.prototype.copyWithin.call(undefined); }, TypeError, 'undefined is not an object');
		st['throws'](function () { return Array.prototype.copyWithin.call(null); }, TypeError, 'null is not an object');
		st.end();
	});

	runTests(callBind(Array.prototype.copyWithin), t);

	t.end();
});
