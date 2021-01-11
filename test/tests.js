'use strict';

var has = require('has');
var getProto = require('es-abstract/helpers/getProto');
var setProto = require('es-abstract/helpers/setProto');

module.exports = function (copyWithin, t) {
	t.test('modifies the object in-place', { only: true }, function (st) {
		var arr = [1, 2, 3, 4, 5];
		st.deepEqual(copyWithin(arr, 0, 3), [4, 5, 3, 4, 5]);
		st.deepEqual(arr, [4, 5, 3, 4, 5]);

		st.end();
	});

	t.test('works with 2 args', function (st) {
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 0, 3), [4, 5, 3, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 1, 3), [1, 4, 5, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 1, 2), [1, 3, 4, 5, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 2, 2), [1, 2, 3, 4, 5]);

		st.end();
	});

	t.test('works with 3 args', function (st) {
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 0, 3, 4), [4, 2, 3, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 1, 3, 4), [1, 4, 3, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 1, 2, 4), [1, 3, 4, 4, 5]);

		st.end();
	});

	t.test('works with negative args', function (st) {
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 0, -2), [4, 5, 3, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], 0, -2, -1), [4, 2, 3, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], -4, -3, -2), [1, 3, 3, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], -4, -3, -1), [1, 3, 4, 4, 5]);
		st.deepEqual(copyWithin([1, 2, 3, 4, 5], -4, -3), [1, 3, 4, 5, 5]);

		st.end();
	});

	t.test('works with arraylike objects', function (st) {
		var args = (function () { return arguments; }(1, 2, 3));
		st.notOk(Array.isArray(args));
		var argsClass = Object.prototype.toString.call(args);
		st.deepEqual(Array.prototype.slice.call(args), [1, 2, 3]);
		copyWithin(args, -2, 0);
		st.deepEqual(Array.prototype.slice.call(args), [1, 1, 2]);
		st.equal(Object.prototype.toString.call(args), argsClass);

		st.end();
	});

	/*
	 *ifSymbolUnscopablesIt('should be unscopable if Symbols exist', function () {
	 *	var unscopables = Array.prototype[Sym.unscopables];
	 *	expect(!!unscopables).to.equal(true);
	 *	expect(unscopables.copyWithin).to.equal(true);
	 *   });
	 */

	/* eslint-disable no-sparse-arrays */
	t.deepEqual(copyWithin([, 1, 2], 1, 0), [, , 1], 'deletes the target key if the source key is not present');
	/* eslint-enable no-sparse-arrays */

	t.test('should check inherited properties as well', function (st) {
		var Parent = function Parent() {};
		Parent.prototype[0] = 'foo';
		var sparse = new Parent();
		sparse[1] = 1;
		sparse[2] = 2;
		sparse.length = 3;
		var result = copyWithin(sparse, 1, 0);
		st.ok('0' in result, 'has inherited 0');
		st.notOk(has(result, '0'), 'lacks own 0');
		st.ok(has(result, '1'), 'has own 1');

		st.equal(result[0], 'foo');
		// use deepLooseEqual here to ignore [[Prototype]] difference
		st.deepLooseEqual(result, { 1: 'foo', 2: 1, length: 3 });

		st.end();
	});

	// https://github.com/tc39/test262/pull/2443
	t.test('security issues', function (st) {
		// make a long integer Array
		var longDenseArray = function longDenseArray() {
			var a = [0];
			for (var i = 0; i < 1024; i++) {
				a[i] = i;
			}
			return a;
		};

		st.test('coerced-values-start-change-start', function (s2t) {
			var currArray;
			var shorten = function shorten() {
				currArray.length = 20;
				return 1000;
			};

			s2t.test('coercion side-effect makes start out of bounds', function (s3t) {
				currArray = longDenseArray();
				var array = [];
				array.length = 20;

				s3t.deepEqual(copyWithin(currArray, 0, { valueOf: shorten }), array);

				s3t.end();
			});

			s2t.test('coercion side-effect makes start out of bounds with prototype', { skip: true || !setProto }, function (s3t) {
				currArray = longDenseArray();
				setProto(currArray, longDenseArray());

				var array2 = longDenseArray();
				array2.length = 20;
				for (var i = 0; i < 24; i++) {
					array2[i] = getProto(currArray)[i + 1000];
				}

				var result = copyWithin(currArray, 0, { valueOf: shorten });
				for (var j = 0; j < array2.length; j += 1) {
					s3t.ok(result.indexOf(array2[j]) > -1, 'result has ' + array2[j] + ' (index ' + j + ')');
				}

				s3t.end();
			});

			s2t.end();
		});

		st.test('coerced-values-start-change-target', function (s2t) {
			var array = longDenseArray();
			array.length = 20;
			for (var i = 0; i < 19; i++) {
				array[i + 1000] = array[i + 1];
			}

			var currArray = longDenseArray();

			var shorten = function shorten() {
				currArray.length = 20;
				return 1;
			};

			s2t.deepEqual(
				copyWithin(currArray, 1000, { valueOf: shorten }),
				array,
				'coercion side-effect makes target out of bounds'
			);

			s2t.end();
		});

		st.end();
	});
};
