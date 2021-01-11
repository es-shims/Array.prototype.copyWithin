import copyWithin from 'array.prototype.copywithin';
import * as Module from 'array.prototype.copywithin';
import test from 'tape';
import runTests from './tests.js';

test('as a function', (t) => {
	t.test('bad array/this value', (st) => {
		st.throws(() => copyWithin(undefined), TypeError, 'undefined is not an object');
		st.throws(() => copyWithin(null), TypeError, 'null is not an object');
		st.end();
	});

	runTests(copyWithin, t);

	t.end();
});

test('named exports', async (t) => {
	t.deepEqual(
		Object.keys(Module).sort(),
		['default', 'shim', 'getPolyfill', 'implementation'].sort(),
		'has expected named exports',
	);

	const { shim, getPolyfill, implementation } = Module;
	t.equal((await import('array.prototype.copywithin/shim')).default, shim, 'shim named export matches deep export');
	t.equal((await import('array.prototype.copywithin/implementation')).default, implementation, 'implementation named export matches deep export');
	t.equal((await import('array.prototype.copywithin/polyfill')).default, getPolyfill, 'getPolyfill named export matches deep export');

	t.end();
});
