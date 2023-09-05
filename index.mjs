import callBind from 'call-bind';
import callBound from 'call-bind/callBound';
import RequireObjectCoercible from 'es-abstract/2023/RequireObjectCoercible.js';

import getPolyfill from 'array.prototype.copywithin/polyfill';

const bound = callBind.apply(getPolyfill());
var $slice = callBound('Array.prototype.slice');

export default function copyWithin(array) {
	RequireObjectCoercible(array);
	return bound(array, $slice(arguments, 1));
}

export { default as getPolyfill } from 'array.prototype.copywithin/polyfill';
export { default as implementation } from 'array.prototype.copywithin/implementation';
export { default as shim } from 'array.prototype.copywithin/shim';
