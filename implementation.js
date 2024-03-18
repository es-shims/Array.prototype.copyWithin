'use strict';

var DeletePropertyOrThrow = require('es-abstract/2024/DeletePropertyOrThrow');
var Get = require('es-abstract/2024/Get');
var HasProperty = require('es-abstract/2024/HasProperty');
var LengthOfArrayLike = require('es-abstract/2024/LengthOfArrayLike');
var Set = require('es-abstract/2024/Set');
var ToIntegerOrInfinity = require('es-abstract/2024/ToIntegerOrInfinity');
var ToObject = require('es-abstract/2024/ToObject');
var ToString = require('es-abstract/2024/ToString');

var GetIntrinsic = require('get-intrinsic');
var max = GetIntrinsic('%Math.max%');
var min = GetIntrinsic('%Math.min%');

module.exports = function copyWithin(target, start) {
	// Let _O_ be ? ToObject(this value).
	var O = ToObject(this);

	// Let _len_ be ? LengthOfArrayLike(_O_).
	var len = LengthOfArrayLike(O);

	// Let _relativeTarget_ be ? ToInteger(_target_).
	var relativeTarget = ToIntegerOrInfinity(target);

	// If _relativeTarget_ < 0, let _to_ be max((len + relativeTarget), 0); else let _to_ be min(relativeTarget, len).
	var to = relativeTarget < 0 ? max(len + relativeTarget, 0) : min(relativeTarget, len);

	// Let _relativeStart_ be ? ToInteger(_start_).
	var relativeStart = ToIntegerOrInfinity(start);

	// If _relativeStart_ < 0, let _from_ be max((_len_ + _relativeStart_), 0); else let _from_ be min(_relativeStart_, _len_).
	var from = relativeStart < 0 ? max(len + relativeStart, 0) : min(relativeStart, len);

	var end;
	if (arguments.length > 2) {
		end = arguments[2];
	}
	// If _end_ is undefined, let _relativeEnd_ be _len_; else let _relativeEnd_ be ? ToInteger(_end_).
	var relativeEnd = typeof end === 'undefined' ? len : ToIntegerOrInfinity(end);

	// If _relativeEnd_ < 0, let _final_ be max((_len_ + _relativeEnd_), 0); else let _final_ be min(_relativeEnd_, _len_).
	var final = relativeEnd < 0 ? max(len + relativeEnd, 0) : min(relativeEnd, len);

	// Let _count_ be min(_final_ - _from_, _len_ - _to_).
	var count = min(final - from, len - to);

	/*
	 *If _from_ < _to_ and _to_ < _from_ + _count_, then
	 *	Let _direction_ be -1.
	 *	Set _from_ to _from_ + _count_ - 1.
	 *	Set _to_ to _to_ + _count_ - 1.
	 *Else,
	 *	Let _direction_ be 1.
	 */
	var direction = 1;
	if (from < to && to < (from + count)) {
		direction = -1;
		from += count - 1;
		to += count - 1;
	}

	// Repeat, while count > 0
	while (count > 0) {
		// Let fromKey be ! ToString(from).
		var fromKey = ToString(from);

		// Let toKey be ! ToString(to).
		var toKey = ToString(to);

		// Let fromPresent be ? HasProperty(O, fromKey).
		var fromPresent = HasProperty(O, fromKey);
		// If fromPresent is true, then
		if (fromPresent) {
			// Let fromVal be ? Get(O, fromKey).
			var fromVal = Get(O, fromKey);

			//  Perform ? Set(O, toKey, fromVal, true).
			Set(O, toKey, fromVal, true);
		} else { // Assert: fromPresent is false.
			// Perform ? DeletePropertyOrThrow(O, toKey).
			DeletePropertyOrThrow(O, toKey);
		}
		// Set from to from + direction.
		from += direction;

		// Set to to to + direction.
		to += direction;

		// Set count to count - 1.
		count -= 1;
	}

	// Return O.
	return O;
};
