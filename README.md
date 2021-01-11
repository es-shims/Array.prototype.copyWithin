# array.prototype.copywithin <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ES2015 spec-compliant `Array.prototype.copyWithin` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec](https://www.ecma-international.org/ecma-262/6.0/).

Because `Array.prototype.copyWithin` depends on a receiver (the “this” value), the main export takes the array to operate on as the first argument.

## Example

```js
var copyWithin = require('array.prototype.copywithin');
var assert = require('assert');

var arr = [1, 2, 3, 4, 5];
assert.deepEqual(copyWithin(arr, 0, 3), [4, 5, 3, 4, 5]);
assert.deepEqual(arr, [4, 5, 3, 4, 5]);
```

```js
var copyWithin = require('array.prototype.copywithin');
var assert = require('assert');
/* when Array#copyWithin is not present */
delete Array.prototype.copyWithin;
var shimmedCopyWithin = copyWithin.shim();
assert.deepStrictEqual(shimmedCopyWithin, copyWithin.getPolyfill());

var arr = [1, 2, 3, 4, 5];
assert.deepEqual(copyWithin(arr, 0, 3), [4, 5, 3, 4, 5]);
assert.deepEqual(arr, [4, 5, 3, 4, 5]);
```

```js
var copyWithin = require('array.prototype.copywithin');
var assert = require('assert');
/* when Array#copyWithin is present */
var shimmedCopyWithin = copyWithin.shim();
assert.equal(shimmedCopyWithin, Array.prototype.copyWithin);

var arr = [1, 2, 3, 4, 5];
assert.deepEqual(copyWithin(arr, 0, 3), [4, 5, 3, 4, 5]);
assert.deepEqual(arr, [4, 5, 3, 4, 5]);
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/array.prototype.copywithin
[npm-version-svg]: http://versionbadg.es/es-shims/Array.prototype.copyWithin.svg
[travis-svg]: https://travis-ci.org/es-shims/Array.prototype.copyWithin.svg
[travis-url]: https://travis-ci.org/es-shims/Array.prototype.copyWithin
[deps-svg]: https://david-dm.org/es-shims/Array.prototype.copyWithin.svg
[deps-url]: https://david-dm.org/es-shims/Array.prototype.copyWithin
[dev-deps-svg]: https://david-dm.org/es-shims/Array.prototype.copyWithin/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Array.prototype.copyWithin#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array.prototype.copywithin.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/array.prototype.copywithin.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/array.prototype.copywithin.svg
[downloads-url]: https://npm-stat.com/charts.html?package=array.prototype.copywithin
