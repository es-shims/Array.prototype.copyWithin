'use strict';

var copyWithin = require('../');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	t.test('bad array/this value', function (st) {
		st['throws'](function () { copyWithin(undefined); }, TypeError, 'undefined is not an object');
		st['throws'](function () { copyWithin(null); }, TypeError, 'null is not an object');
		st.end();
	});

	runTests(copyWithin, t);

	t.end();
});
