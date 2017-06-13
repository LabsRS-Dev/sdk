/**
 * DoveMaxSDK v1.1.4
 * (c) 2017 Gmagon Inc. && Romanysoft LAB.
 * @license MIT
 */
'use strict';

/*eslint-disable*/
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.


// Baseline setup
// --------------

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self ||
          typeof global == 'object' && global.global === global && global ||
          {};

// Save the previous value of the `_` variable.
var previousUnderscore = root._;

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push;
var slice = ArrayProto.slice;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray;
var nativeKeys = Object.keys;
var nativeCreate = Object.create;

// Naked function reference for surrogate-prototype-swapping.
var Ctor = function(){};

// Create a safe reference to the Underscore object for use below.
var _$1 = function(obj) {
  if (obj instanceof _$1) { return obj; }
  if (!(this instanceof _$1)) { return new _$1(obj); }
  this._wrapped = obj;
};

// Export the Underscore object for **Node.js**, with
// backwards-compatibility for their old module API. If we're in
// the browser, add `_` as a global object.
// (`nodeType` is checked to ensure that `module`
// and `exports` are not HTML elements.)
if (typeof exports != 'undefined' && !exports.nodeType) {
  if (typeof module != 'undefined' && !module.nodeType && module.exports) {
    exports = module.exports = _$1;
  }
  exports._ = _$1;
} else {
  root._ = _$1;
}

// Current version.
_$1.VERSION = '1.8.3';

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb = function(func, context, argCount) {
  if (context === void 0) { return func; }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-parameter case has been omitted only because no current consumers
    // made use of it.
    case null:
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
};

var builtinIteratee;

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `identity`,
// an arbitrary callback, a property matcher, or a property accessor.
var cb = function(value, context, argCount) {
  if (_$1.iteratee !== builtinIteratee) { return _$1.iteratee(value, context); }
  if (value == null) { return _$1.identity; }
  if (_$1.isFunction(value)) { return optimizeCb(value, context, argCount); }
  if (_$1.isObject(value) && !_$1.isArray(value)) { return _$1.matcher(value); }
  return _$1.property(value);
};

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only argCount argument.
_$1.iteratee = builtinIteratee = function(value, context) {
  return cb(value, context, Infinity);
};

// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
// This accumulates the arguments passed into an array, after a given index.
var restArgs = function(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var arguments$1 = arguments;

    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
    for (; index < length; index++) {
      rest[index] = arguments$1[index + startIndex];
    }
    switch (startIndex) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, arguments[0], rest);
      case 2: return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments$1[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
};

// An internal function for creating a new object that inherits from another.
var baseCreate = function(prototype) {
  if (!_$1.isObject(prototype)) { return {}; }
  if (nativeCreate) { return nativeCreate(prototype); }
  Ctor.prototype = prototype;
  var result = new Ctor;
  Ctor.prototype = null;
  return result;
};

var shallowProperty = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};

var deepGet = function(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) { return void 0; }
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
};

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = shallowProperty('length');
var isArrayLike = function(collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

// Collection Functions
// --------------------

// The cornerstone, an `each` implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
_$1.each = _$1.forEach = function(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var keys = _$1.keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
};

// Return the results of applying the iteratee to each element.
_$1.map = _$1.collect = function(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var keys = !isArrayLike(obj) && _$1.keys(obj),
      length = (keys || obj).length,
      results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
};

// Create a reducing function iterating left or right.
var createReduce = function(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function(obj, iteratee, memo, initial) {
    var keys = !isArrayLike(obj) && _$1.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
};

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
_$1.reduce = _$1.foldl = _$1.inject = createReduce(1);

// The right-associative version of reduce, also known as `foldr`.
_$1.reduceRight = _$1.foldr = createReduce(-1);

// Return the first value which passes a truth test. Aliased as `detect`.
_$1.find = _$1.detect = function(obj, predicate, context) {
  var keyFinder = isArrayLike(obj) ? _$1.findIndex : _$1.findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) { return obj[key]; }
};

// Return all the elements that pass a truth test.
// Aliased as `select`.
_$1.filter = _$1.select = function(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  _$1.each(obj, function(value, index, list) {
    if (predicate(value, index, list)) { results.push(value); }
  });
  return results;
};

// Return all the elements for which a truth test fails.
_$1.reject = function(obj, predicate, context) {
  return _$1.filter(obj, _$1.negate(cb(predicate)), context);
};

// Determine whether all of the elements match a truth test.
// Aliased as `all`.
_$1.every = _$1.all = function(obj, predicate, context) {
  predicate = cb(predicate, context);
  var keys = !isArrayLike(obj) && _$1.keys(obj),
      length = (keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) { return false; }
  }
  return true;
};

// Determine if at least one element in the object matches a truth test.
// Aliased as `any`.
_$1.some = _$1.any = function(obj, predicate, context) {
  predicate = cb(predicate, context);
  var keys = !isArrayLike(obj) && _$1.keys(obj),
      length = (keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) { return true; }
  }
  return false;
};

// Determine if the array or object contains a given item (using `===`).
// Aliased as `includes` and `include`.
_$1.contains = _$1.includes = _$1.include = function(obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) { obj = _$1.values(obj); }
  if (typeof fromIndex != 'number' || guard) { fromIndex = 0; }
  return _$1.indexOf(obj, item, fromIndex) >= 0;
};

// Invoke a method (with arguments) on every item in a collection.
_$1.invoke = restArgs(function(obj, path, args) {
  var contextPath, func;
  if (_$1.isFunction(path)) {
    func = path;
  } else if (_$1.isArray(path)) {
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return _$1.map(obj, function(context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) { return void 0; }
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
});

// Convenience version of a common use case of `map`: fetching a property.
_$1.pluck = function(obj, key) {
  return _$1.map(obj, _$1.property(key));
};

// Convenience version of a common use case of `filter`: selecting only objects
// containing specific `key:value` pairs.
_$1.where = function(obj, attrs) {
  return _$1.filter(obj, _$1.matcher(attrs));
};

// Convenience version of a common use case of `find`: getting the first object
// containing specific `key:value` pairs.
_$1.findWhere = function(obj, attrs) {
  return _$1.find(obj, _$1.matcher(attrs));
};

// Return the maximum element (or element-based computation).
_$1.max = function(obj, iteratee, context) {
  var result = -Infinity, lastComputed = -Infinity,
      value, computed;
  if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
    obj = isArrayLike(obj) ? obj : _$1.values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    _$1.each(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
};

// Return the minimum element (or element-based computation).
_$1.min = function(obj, iteratee, context) {
  var result = Infinity, lastComputed = Infinity,
      value, computed;
  if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
    obj = isArrayLike(obj) ? obj : _$1.values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    _$1.each(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed < lastComputed || computed === Infinity && result === Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
};

// Shuffle a collection.
_$1.shuffle = function(obj) {
  return _$1.sample(obj, Infinity);
};

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `map`.
_$1.sample = function(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) { obj = _$1.values(obj); }
    return obj[_$1.random(obj.length - 1)];
  }
  var sample = isArrayLike(obj) ? _$1.clone(obj) : _$1.values(obj);
  var length = getLength(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = _$1.random(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
};

// Sort the object's values by a criterion produced by an iteratee.
_$1.sortBy = function(obj, iteratee, context) {
  var index = 0;
  iteratee = cb(iteratee, context);
  return _$1.pluck(_$1.map(obj, function(value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) { return 1; }
      if (a < b || b === void 0) { return -1; }
    }
    return left.index - right.index;
  }), 'value');
};

// An internal function used for aggregate "group by" operations.
var group = function(behavior, partition) {
  return function(obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = cb(iteratee, context);
    _$1.each(obj, function(value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
};

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
_$1.groupBy = group(function(result, value, key) {
  if (_$1.has(result, key)) { result[key].push(value); } else { result[key] = [value]; }
});

// Indexes the object's values by a criterion, similar to `groupBy`, but for
// when you know that your index values will be unique.
_$1.indexBy = group(function(result, value, key) {
  result[key] = value;
});

// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
_$1.countBy = group(function(result, value, key) {
  if (_$1.has(result, key)) { result[key]++; } else { result[key] = 1; }
});

var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
// Safely create a real, live array from anything iterable.
_$1.toArray = function(obj) {
  if (!obj) { return []; }
  if (_$1.isArray(obj)) { return slice.call(obj); }
  if (_$1.isString(obj)) {
    // Keep surrogate pair characters together
    return obj.match(reStrSymbol);
  }
  if (isArrayLike(obj)) { return _$1.map(obj, _$1.identity); }
  return _$1.values(obj);
};

// Return the number of elements in an object.
_$1.size = function(obj) {
  if (obj == null) { return 0; }
  return isArrayLike(obj) ? obj.length : _$1.keys(obj).length;
};

// Split a collection into two arrays: one whose elements all satisfy the given
// predicate, and one whose elements all do not satisfy the predicate.
_$1.partition = group(function(result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true);

// Array Functions
// ---------------

// Get the first element of an array. Passing **n** will return the first N
// values in the array. Aliased as `head` and `take`. The **guard** check
// allows it to work with `_.map`.
_$1.first = _$1.head = _$1.take = function(array, n, guard) {
  if (array == null || array.length < 1) { return void 0; }
  if (n == null || guard) { return array[0]; }
  return _$1.initial(array, array.length - n);
};

// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
_$1.initial = function(array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
};

// Get the last element of an array. Passing **n** will return the last N
// values in the array.
_$1.last = function(array, n, guard) {
  if (array == null || array.length < 1) { return void 0; }
  if (n == null || guard) { return array[array.length - 1]; }
  return _$1.rest(array, Math.max(0, array.length - n));
};

// Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
// Especially useful on the arguments object. Passing an **n** will return
// the rest N values in the array.
_$1.rest = _$1.tail = _$1.drop = function(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
};

// Trim out all falsy values from an array.
_$1.compact = function(array) {
  return _$1.filter(array, Boolean);
};

// Internal implementation of a recursive `flatten` function.
var flatten = function(input, shallow, strict, output) {
  output = output || [];
  var idx = output.length;
  for (var i = 0, length = getLength(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike(value) && (_$1.isArray(value) || _$1.isArguments(value))) {
      // Flatten current level of array or arguments object.
      if (shallow) {
        var j = 0, len = value.length;
        while (j < len) { output[idx++] = value[j++]; }
      } else {
        flatten(value, shallow, strict, output);
        idx = output.length;
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
};

// Flatten out an array, either recursively (by default), or just one level.
_$1.flatten = function(array, shallow) {
  return flatten(array, shallow, false);
};

// Return a version of the array that does not contain the specified value(s).
_$1.without = restArgs(function(array, otherArrays) {
  return _$1.difference(array, otherArrays);
});

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// Aliased as `unique`.
_$1.uniq = _$1.unique = function(array, isSorted, iteratee, context) {
  if (!_$1.isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) { iteratee = cb(iteratee, context); }
  var result = [];
  var seen = [];
  for (var i = 0, length = getLength(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted) {
      if (!i || seen !== computed) { result.push(value); }
      seen = computed;
    } else if (iteratee) {
      if (!_$1.contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!_$1.contains(result, value)) {
      result.push(value);
    }
  }
  return result;
};

// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
_$1.union = restArgs(function(arrays) {
  return _$1.uniq(flatten(arrays, true, true));
});

// Produce an array that contains every item shared between all the
// passed-in arrays.
_$1.intersection = function(array) {
  var arguments$1 = arguments;

  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength(array); i < length; i++) {
    var item = array[i];
    if (_$1.contains(result, item)) { continue; }
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!_$1.contains(arguments$1[j], item)) { break; }
    }
    if (j === argsLength) { result.push(item); }
  }
  return result;
};

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
_$1.difference = restArgs(function(array, rest) {
  rest = flatten(rest, true, true);
  return _$1.filter(array, function(value){
    return !_$1.contains(rest, value);
  });
});

// Complement of _.zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
_$1.unzip = function(array) {
  var length = array && _$1.max(array, getLength).length || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = _$1.pluck(array, index);
  }
  return result;
};

// Zip together multiple lists into a single array -- elements that share
// an index go together.
_$1.zip = restArgs(_$1.unzip);

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of _.pairs.
_$1.object = function(list, values) {
  var result = {};
  for (var i = 0, length = getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
};

// Generator function to create the findIndex and findLastIndex functions.
var createPredicateIndexFinder = function(dir) {
  return function(array, predicate, context) {
    predicate = cb(predicate, context);
    var length = getLength(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) { return index; }
    }
    return -1;
  };
};

// Returns the first index on an array-like that passes a predicate test.
_$1.findIndex = createPredicateIndexFinder(1);
_$1.findLastIndex = createPredicateIndexFinder(-1);

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
_$1.sortedIndex = function(array, obj, iteratee, context) {
  iteratee = cb(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0, high = getLength(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) { low = mid + 1; } else { high = mid; }
  }
  return low;
};

// Generator function to create the indexOf and lastIndexOf functions.
var createIndexFinder = function(dir, predicateFind, sortedIndex) {
  return function(array, item, idx) {
    var i = 0, length = getLength(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), _$1.isNaN);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) { return idx; }
    }
    return -1;
  };
};

// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
_$1.indexOf = createIndexFinder(1, _$1.findIndex, _$1.sortedIndex);
_$1.lastIndexOf = createIndexFinder(-1, _$1.findLastIndex);

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](http://docs.python.org/library/functions.html#range).
_$1.range = function(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
};

// Split an **array** into several arrays containing **count** or less elements
// of initial array.
_$1.chunk = function(array, count) {
  if (count == null || count < 1) { return []; }

  var result = [];
  var i = 0, length = array.length;
  while (i < length) {
    result.push(slice.call(array, i, i += count));
  }
  return result;
};

// Function (ahem) Functions
// ------------------

// Determines whether to execute a function as a constructor
// or a normal function with the provided arguments.
var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) { return sourceFunc.apply(context, args); }
  var self = baseCreate(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (_$1.isObject(result)) { return result; }
  return self;
};

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
_$1.bind = restArgs(function(func, context, args) {
  if (!_$1.isFunction(func)) { throw new TypeError('Bind must be called on a function'); }
  var bound = restArgs(function(callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
_$1.partial = restArgs(function(func, boundArgs) {
  var placeholder = _$1.partial.placeholder;
  var bound = function() {
    var arguments$1 = arguments;

    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments$1[position++] : boundArgs[i];
    }
    while (position < arguments.length) { args.push(arguments$1[position++]); }
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});

_$1.partial.placeholder = _$1;

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
_$1.bindAll = restArgs(function(obj, keys) {
  keys = flatten(keys, false, false);
  var index = keys.length;
  if (index < 1) { throw new Error('bindAll must be passed function names'); }
  while (index--) {
    var key = keys[index];
    obj[key] = _$1.bind(obj[key], obj);
  }
});

// Memoize an expensive function by storing its results.
_$1.memoize = function(func, hasher) {
  var memoize = function(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!_$1.has(cache, address)) { cache[address] = func.apply(this, arguments); }
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
};

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
_$1.delay = restArgs(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
});

// Defers a function, scheduling it to run after the current call stack has
// cleared.
_$1.defer = _$1.partial(_$1.delay, _$1, 1);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
_$1.throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) { options = {}; }

  var later = function() {
    previous = options.leading === false ? 0 : _$1.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) { context = args = null; }
  };

  var throttled = function() {
    var now = _$1.now();
    if (!previous && options.leading === false) { previous = now; }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) { context = args = null; }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_$1.debounce = function(func, wait, immediate) {
  var timeout, result;

  var later = function(context, args) {
    timeout = null;
    if (args) { result = func.apply(context, args); }
  };

  var debounced = restArgs(function(args) {
    if (timeout) { clearTimeout(timeout); }
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) { result = func.apply(this, args); }
    } else {
      timeout = _$1.delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
_$1.wrap = function(func, wrapper) {
  return _$1.partial(wrapper, func);
};

// Returns a negated version of the passed-in predicate.
_$1.negate = function(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
};

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
_$1.compose = function() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var this$1 = this;

    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) { result = args[i].call(this$1, result); }
    return result;
  };
};

// Returns a function that will only be executed on and after the Nth call.
_$1.after = function(times, func) {
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
};

// Returns a function that will only be executed up to (but not including) the Nth call.
_$1.before = function(times, func) {
  var memo;
  return function() {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) { func = null; }
    return memo;
  };
};

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
_$1.once = _$1.partial(_$1.before, 2);

_$1.restArgs = restArgs;

// Object Functions
// ----------------

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

var collectNonEnumProps = function(obj, keys) {
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = _$1.isFunction(constructor) && constructor.prototype || ObjProto;

  // Constructor is a special case.
  var prop = 'constructor';
  if (_$1.has(obj, prop) && !_$1.contains(keys, prop)) { keys.push(prop); }

  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !_$1.contains(keys, prop)) {
      keys.push(prop);
    }
  }
};

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
_$1.keys = function(obj) {
  if (!_$1.isObject(obj)) { return []; }
  if (nativeKeys) { return nativeKeys(obj); }
  var keys = [];
  for (var key in obj) { if (_$1.has(obj, key)) { keys.push(key); } }
  // Ahem, IE < 9.
  if (hasEnumBug) { collectNonEnumProps(obj, keys); }
  return keys;
};

// Retrieve all the property names of an object.
_$1.allKeys = function(obj) {
  if (!_$1.isObject(obj)) { return []; }
  var keys = [];
  for (var key in obj) { keys.push(key); }
  // Ahem, IE < 9.
  if (hasEnumBug) { collectNonEnumProps(obj, keys); }
  return keys;
};

// Retrieve the values of an object's properties.
_$1.values = function(obj) {
  var keys = _$1.keys(obj);
  var length = keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]];
  }
  return values;
};

// Returns the results of applying the iteratee to each element of the object.
// In contrast to _.map it returns an object.
_$1.mapObject = function(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var keys = _$1.keys(obj),
      length = keys.length,
      results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
};

// Convert an object into a list of `[key, value]` pairs.
// The opposite of _.object.
_$1.pairs = function(obj) {
  var keys = _$1.keys(obj);
  var length = keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [keys[i], obj[keys[i]]];
  }
  return pairs;
};

// Invert the keys and values of an object. The values must be serializable.
_$1.invert = function(obj) {
  var result = {};
  var keys = _$1.keys(obj);
  for (var i = 0, length = keys.length; i < length; i++) {
    result[obj[keys[i]]] = keys[i];
  }
  return result;
};

// Return a sorted list of the function names available on the object.
// Aliased as `methods`.
_$1.functions = _$1.methods = function(obj) {
  var names = [];
  for (var key in obj) {
    if (_$1.isFunction(obj[key])) { names.push(key); }
  }
  return names.sort();
};

// An internal function for creating assigner functions.
var createAssigner = function(keysFunc, defaults) {
  return function(obj) {
    var arguments$1 = arguments;

    var length = arguments.length;
    if (defaults) { obj = Object(obj); }
    if (length < 2 || obj == null) { return obj; }
    for (var index = 1; index < length; index++) {
      var source = arguments$1[index],
          keys = keysFunc(source),
          l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) { obj[key] = source[key]; }
      }
    }
    return obj;
  };
};

// Extend a given object with all the properties in passed-in object(s).
_$1.extend = createAssigner(_$1.allKeys);

// Assigns a given object with all the own properties in the passed-in object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
_$1.extendOwn = _$1.assign = createAssigner(_$1.keys);

// Returns the first key on an object that passes a predicate test.
_$1.findKey = function(obj, predicate, context) {
  predicate = cb(predicate, context);
  var keys = _$1.keys(obj), key;
  for (var i = 0, length = keys.length; i < length; i++) {
    key = keys[i];
    if (predicate(obj[key], key, obj)) { return key; }
  }
};

// Internal pick helper function to determine if `obj` has key `key`.
var keyInObj = function(value, key, obj) {
  return key in obj;
};

// Return a copy of the object only containing the whitelisted properties.
_$1.pick = restArgs(function(obj, keys) {
  var result = {}, iteratee = keys[0];
  if (obj == null) { return result; }
  if (_$1.isFunction(iteratee)) {
    if (keys.length > 1) { iteratee = optimizeCb(iteratee, keys[1]); }
    keys = _$1.allKeys(obj);
  } else {
    iteratee = keyInObj;
    keys = flatten(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) { result[key] = value; }
  }
  return result;
});

// Return a copy of the object without the blacklisted properties.
_$1.omit = restArgs(function(obj, keys) {
  var iteratee = keys[0], context;
  if (_$1.isFunction(iteratee)) {
    iteratee = _$1.negate(iteratee);
    if (keys.length > 1) { context = keys[1]; }
  } else {
    keys = _$1.map(flatten(keys, false, false), String);
    iteratee = function(value, key) {
      return !_$1.contains(keys, key);
    };
  }
  return _$1.pick(obj, iteratee, context);
});

// Fill in a given object with default properties.
_$1.defaults = createAssigner(_$1.allKeys, true);

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
_$1.create = function(prototype, props) {
  var result = baseCreate(prototype);
  if (props) { _$1.extendOwn(result, props); }
  return result;
};

// Create a (shallow-cloned) duplicate of an object.
_$1.clone = function(obj) {
  if (!_$1.isObject(obj)) { return obj; }
  return _$1.isArray(obj) ? obj.slice() : _$1.extend({}, obj);
};

// Invokes interceptor with the obj, and then returns obj.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
_$1.tap = function(obj, interceptor) {
  interceptor(obj);
  return obj;
};

// Returns whether an object has a given set of `key:value` pairs.
_$1.isMatch = function(object, attrs) {
  var keys = _$1.keys(attrs), length = keys.length;
  if (object == null) { return !length; }
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) { return false; }
  }
  return true;
};


// Internal recursive comparison function for `isEqual`.
var eq;
var deepEq;
eq = function(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) { return a !== 0 || 1 / a === 1 / b; }
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) { return false; }
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) { return b !== b; }
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') { return false; }
  return deepEq(a, b, aStack, bStack);
};

// Internal recursive comparison function for `isEqual`.
deepEq = function(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof _$1) { a = a._wrapped; }
  if (b instanceof _$1) { b = b._wrapped; }
  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className !== toString.call(b)) { return false; }
  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case '[object RegExp]':
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) { return +b !== +b; }
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case '[object Symbol]':
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
  }

  var areArrays = className === '[object Array]';
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') { return false; }

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_$1.isFunction(aCtor) && aCtor instanceof aCtor &&
                              _$1.isFunction(bCtor) && bCtor instanceof bCtor)
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) { return bStack[length] === b; }
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) { return false; }
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) { return false; }
    }
  } else {
    // Deep compare objects.
    var keys = _$1.keys(a), key;
    length = keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (_$1.keys(b).length !== length) { return false; }
    while (length--) {
      // Deep compare each member
      key = keys[length];
      if (!(_$1.has(b, key) && eq(a[key], b[key], aStack, bStack))) { return false; }
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
};

// Perform a deep comparison to check if two objects are equal.
_$1.isEqual = function(a, b) {
  return eq(a, b);
};

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
_$1.isEmpty = function(obj) {
  if (obj == null) { return true; }
  if (isArrayLike(obj) && (_$1.isArray(obj) || _$1.isString(obj) || _$1.isArguments(obj))) { return obj.length === 0; }
  return _$1.keys(obj).length === 0;
};

// Is a given value a DOM element?
_$1.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1);
};

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
_$1.isArray = nativeIsArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

// Is a given variable an object?
_$1.isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
_$1.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
  _$1['is' + name] = function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
});

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
if (!_$1.isArguments(arguments)) {
  _$1.isArguments = function(obj) {
    return _$1.has(obj, 'callee');
  };
}

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  _$1.isFunction = function(obj) {
    return typeof obj == 'function' || false;
  };
}

// Is a given object a finite number?
_$1.isFinite = function(obj) {
  return !_$1.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
};

// Is the given value `NaN`?
_$1.isNaN = function(obj) {
  return _$1.isNumber(obj) && isNaN(obj);
};

// Is a given value a boolean?
_$1.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

// Is a given value equal to null?
_$1.isNull = function(obj) {
  return obj === null;
};

// Is a given variable undefined?
_$1.isUndefined = function(obj) {
  return obj === void 0;
};

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
_$1.has = function(obj, path) {
  if (!_$1.isArray(path)) {
    return obj != null && hasOwnProperty.call(obj, path);
  }
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (obj == null || !hasOwnProperty.call(obj, key)) {
      return false;
    }
    obj = obj[key];
  }
  return !!length;
};

// Utility Functions
// -----------------

// Run Underscore.js in *noConflict* mode, returning the `_` variable to its
// previous owner. Returns a reference to the Underscore object.
_$1.noConflict = function() {
  root._ = previousUnderscore;
  return this;
};

// Keep the identity function around for default iteratees.
_$1.identity = function(value) {
  return value;
};

// Predicate-generating functions. Often useful outside of Underscore.
_$1.constant = function(value) {
  return function() {
    return value;
  };
};

_$1.noop = function(){};

_$1.property = function(path) {
  if (!_$1.isArray(path)) {
    return shallowProperty(path);
  }
  return function(obj) {
    return deepGet(obj, path);
  };
};

// Generates a function for a given object that returns a given property.
_$1.propertyOf = function(obj) {
  if (obj == null) {
    return function(){};
  }
  return function(path) {
    return !_$1.isArray(path) ? obj[path] : deepGet(obj, path);
  };
};

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
_$1.matcher = _$1.matches = function(attrs) {
  attrs = _$1.extendOwn({}, attrs);
  return function(obj) {
    return _$1.isMatch(obj, attrs);
  };
};

// Run a function **n** times.
_$1.times = function(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = optimizeCb(iteratee, context, 1);
  for (var i = 0; i < n; i++) { accum[i] = iteratee(i); }
  return accum;
};

// Return a random integer between min and max (inclusive).
_$1.random = function(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

// A (possibly faster) way to get the current timestamp as an integer.
_$1.now = Date.now || function() {
  return new Date().getTime();
};

// List of HTML entities for escaping.
var escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
};
var unescapeMap = _$1.invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
var createEscaper = function(map) {
  var escaper = function(match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + _$1.keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
};
_$1.escape = createEscaper(escapeMap);
_$1.unescape = createEscaper(unescapeMap);

// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
_$1.result = function(obj, path, fallback) {
  if (!_$1.isArray(path)) { path = [path]; }
  var length = path.length;
  if (!length) {
    return _$1.isFunction(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }
    obj = _$1.isFunction(prop) ? prop.call(obj) : prop;
  }
  return obj;
};

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
_$1.uniqueId = function(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
};

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
_$1.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
};

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

var escapeChar = function(match) {
  return '\\' + escapes[match];
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
_$1.template = function(text, settings, oldSettings) {
  if (!settings && oldSettings) { settings = oldSettings; }
  settings = _$1.defaults({}, settings, _$1.templateSettings);

  // Combine delimiters into one regular expression via alternation.
  var matcher = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join('|') + '|$', 'g');

  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";

  // If a variable is not specified, place data values in local scope.
  if (!settings.variable) { source = 'with(obj||{}){\n' + source + '}\n'; }

  source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + 'return __p;\n';

  var render;
  try {
    render = new Function(settings.variable || 'obj', '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function(data) {
    return render.call(this, data, _$1);
  };

  // Provide the compiled source as a convenience for precompilation.
  var argument = settings.variable || 'obj';
  template.source = 'function(' + argument + '){\n' + source + '}';

  return template;
};

// Add a "chain" function. Start chaining a wrapped Underscore object.
_$1.chain = function(obj) {
  var instance = _$1(obj);
  instance._chain = true;
  return instance;
};

// OOP
// ---------------
// If Underscore is called as a function, it returns a wrapped object that
// can be used OO-style. This wrapper holds altered versions of all the
// underscore functions. Wrapped objects may be chained.

// Helper function to continue chaining intermediate results.
var chainResult = function(instance, obj) {
  return instance._chain ? _$1(obj).chain() : obj;
};

// Add your own custom functions to the Underscore object.
_$1.mixin = function(obj) {
  _$1.each(_$1.functions(obj), function(name) {
    var func = _$1[name] = obj[name];
    _$1.prototype[name] = function() {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_$1, args));
    };
  });
  return _$1;
};

// Add all of the Underscore functions to the wrapper object.
_$1.mixin(_$1);

// Add all mutator Array functions to the wrapper.
_$1.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  var method = ArrayProto[name];
  _$1.prototype[name] = function() {
    var obj = this._wrapped;
    method.apply(obj, arguments);
    if ((name === 'shift' || name === 'splice') && obj.length === 0) { delete obj[0]; }
    return chainResult(this, obj);
  };
});

// Add all accessor Array functions to the wrapper.
_$1.each(['concat', 'join', 'slice'], function(name) {
  var method = ArrayProto[name];
  _$1.prototype[name] = function() {
    return chainResult(this, method.apply(this._wrapped, arguments));
  };
});

// Extracts the result from a wrapped and chained object.
_$1.prototype.value = function() {
  return this._wrapped;
};

// Provide unwrapping proxy for some methods used in engine operations
// such as arithmetic and JSON stringification.
_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

_$1.prototype.toString = function() {
  return String(this._wrapped);
};

// AMD registration happens at the end for compatibility with AMD loaders
// that may not enforce next-turn semantics on modules. Even though general
// practice for AMD registration is to be anonymous, underscore registers
// as a named module because, like jQuery, it is a base library that is
// popular enough to be bundled in a third party lib, but not be part of
// an AMD load request. Those cases could generate an error when an
// anonymous define() is called outside of a loader request.
if (typeof define == 'function' && define.amd) {
  define('underscore', [], function() {
    return _$1;
  });
}



var underscore = {
  _:_$1
};

var _ = underscore._;

// -----------------------------------------------------------------
// extend from kendo.core.js

function deepExtend (destination) {
  var arguments$1 = arguments;

  var i = 1,
    length = arguments.length;

  for (i = 1; i < length; i++) {
    deepExtendOne(destination, arguments$1[i]);
  }
  return destination
}

function deepExtendOne (destination, source) {
  var property,
    propValue,
    propType,
    propInit,
    destProp;

  for (property in source) {
    propValue = source[property];
    propType = typeof propValue;

    if (propType === 'object' && propValue !== null) {
      propInit = propValue.constructor;
    } else {
      propInit = null;
    }

    if (propInit &&
      propInit !== Array && propInit !== RegExp) {
      if (propValue instanceof Date) {
        destination[property] = new Date(propValue.getTime());
      } else if (_.isFunction(propValue.clone)) {
        destination[property] = _.clone(propValue);
      } else {
        destProp = destination[property];
        if (typeof (destProp) === 'object') {
          destination[property] = destProp || {};
        } else {
          destination[property] = {};
        }
        deepExtendOne(destination[property], propValue);
      }
    } else if (propType !== 'undefined') {
      destination[property] = propValue;
    }
  }

  return destination
}

var preventDefault = function () {
  this._defaultPrevented = true;
};

var isDefaultPrevented = function () {
  return this._defaultPrevented === true
};

function SelfClass () {}
SelfClass.extend = function (proto) {
  var base = function () {},
    member,
    that = this,
    subclass = proto && proto.init ? proto.init : function () {
      that.apply(this, arguments);
    },
    fn;

  base.prototype = that.prototype;
  fn = subclass.fn = subclass.prototype = new base();

  for (member in proto) {
    if (proto[member] != null && proto[member].constructor === Object) {
      // Merge object members
      // fn[member] = extend(true, {}, base.prototype[member], proto[member])
      // fn[member] = _.extend({}, base.prototype[member], proto[member])
      fn[member] = deepExtend({}, base.prototype[member], proto[member]);
    } else {
      fn[member] = proto[member];

      if (_.isFunction(proto[member])) {
        fn[member].bind(subclass);
      }
    }
  }

  fn.constructor = subclass;
  subclass.extend = that.extend;

  return subclass
};

SelfClass.prototype._initOptions = function (options) {
  this.options = deepExtend({}, this.options, options);
};

var Observable = SelfClass.extend({
  init: function () {
    this._events = {};
    this._name = _.uniqueId('SDK-Observable-');
  },

  getInternalName: function () {
    return this._name
  },

  getMetaDataEvents: function () {
    return this._events
  },

  bind: function (eventName, handlers, one) {
    var that = this,
      idx,
      eventNames = typeof eventName === 'string' ? [eventName] : eventName,
      length,
      original,
      handler,
      handlersIsFunction = typeof handlers === 'function',
      events;

    if (handlers === undefined) {
      for (idx in eventName) {
        that.bind(idx, eventName[idx]);
      }
      return that
    }

    for (idx = 0, length = eventNames.length; idx < length; idx++) {
      eventName = eventNames[idx];

      handler = handlersIsFunction ? handlers : handlers[eventName];

      if (handler) {
        if (one) {
          original = handler;
          handler = function () {
            that.unbind(eventName, handler);
            original.apply(that, arguments);
          };
          handler.original = original;
        }
        events = that._events[eventName] = that._events[eventName] || [];
        events.push(handler);
      }
    }

    return that
  },

  one: function (eventNames, handlers) {
    return this.bind(eventNames, handlers, true)
  },

  first: function (eventName, handlers) {
    var that = this,
      idx,
      eventNames = typeof eventName === 'string' ? [eventName] : eventName,
      length,
      handler,
      handlersIsFunction = typeof handlers === 'function',
      events;

    for (idx = 0, length = eventNames.length; idx < length; idx++) {
      eventName = eventNames[idx];

      handler = handlersIsFunction ? handlers : handlers[eventName];

      if (handler) {
        events = that._events[eventName] = that._events[eventName] || [];
        events.unshift(handler);
      }
    }

    return that
  },

  trigger: function (eventName, e) {
    var that = this,
      events = that._events[eventName],
      idx,
      length;

    if (events) {
      if (_.isString(e)) {
        console.error('e must be {}, not string ');
      }

      e = e || {};

      e.sender = that;

      e._defaultPrevented = false;

      e.preventDefault = preventDefault;

      e.isDefaultPrevented = isDefaultPrevented;

      events = events.slice();

      for (idx = 0, length = events.length; idx < length; idx++) {
        events[idx].call(that, e);
      }

      return e._defaultPrevented === true
    }

    return false
  },

  unbind: function (eventName, handler) {
    var that = this,
      events = that._events[eventName],
      idx;

    if (eventName === undefined) {
      that._events = {};
    } else if (events) {
      if (handler) {
        for (idx = events.length - 1; idx >= 0; idx--) {
          if (events[idx] === handler || events[idx].original === handler) {
            events.splice(idx, 1);
          }
        }
      } else {
        that._events[eventName] = [];
      }
    }

    return that
  }
});

var _$3 = underscore._;

// Object functions
// -------------------------------------------------------------------------
var $bc_$1 = {};

$bc_$1.pN = $bc_$1.pNative = null; // 调用底层接口
$bc_$1.pIsUseElectron = false; // 是否使用了Electron引擎,默认是没有使用
$bc_$1.pIsUseMacCocoEngine = false; // 是否使用了MacOSX本地引擎

// 定义临时回调处理函数定义接口

$bc_$1._get_callback = function (func, noDelete) {
  if ( noDelete === void 0 ) noDelete = true;

  var _nativeCallback = {};
  try {
    window._nativeCallback = window._nativeCallback || {};
    _nativeCallback = window._nativeCallback;
  } catch (error) {
    console.error(error);
  }

  var r = _$3.uniqueId('ncb' + _$3.now()) + _$3.uniqueId('n' + _$3.random(0, 99999));
  var rFnc = r + '_fnc';

  _nativeCallback[rFnc] = func;
  _nativeCallback[r] = function () {
    try {
      if (!noDelete) {
        delete _nativeCallback[r];
        delete _nativeCallback[rFnc];
      }
    } catch (e) {
      console.error(e);
    }

    if (_$3.isFunction(func)) {
      func.apply(null, arguments);
    }
  };
  return '_nativeCallback.' + r
};

$bc_$1.cb_execTaskUpdateInfo = null; // 执行任务的回调
$bc_$1.pCorePlugin = { // 核心处理引导插件部分,尽量不要修改
  useThread: true,
  passBack: 'BS.b$.cb_execTaskUpdateInfo',
  packageMode: 'bundle',
  taskToolPath: '/Plugins/extendLoader.bundle',
  bundleClassName: 'LibCommonInterface'
};

$bc_$1.pIAPPlugin = {
  path: '/plugin.iap.bundle'
};

// 自动匹配检测
var __auto = function (ref) {
  try {
    if ((typeof window.maccocojs !== 'undefined') && (typeof window.maccocojs === 'object') && window.maccocojs.hasOwnProperty('app')) {
      ref.pN = ref.pNative = window.maccocojs; // 原MacOSX本地引擎
      ref.pIsUseMacCocoEngine = true;
      ref.pIsUseElectron = false;
    } else if ((typeof process === 'object') && (typeof require === 'function') && (process.hasOwnProperty('pid'))) {
      try {
        console.log('============= must first load =================');
        try {
          window['eletron_require'] = window.require;
          window['eletron_module'] = window.module;

          // Electron引擎加载方式，兼容新的及老的版本。支持：最新1.1.3和0.34版本系列
          try {
            ref.pN = ref.pNative = window.eval('require("remote").require("./romanysoft/maccocojs")');
          } catch (error) {
            ref.pN = ref.pNative = window.eval('require("electron").remote.require("./romanysoft/maccocojs")');
          }

          // 重新处理require,module的关系
          window.require = undefined;
          window.module.exports = undefined;
          window.module = undefined;
        } catch (error) {
          console.error(error);
        }
        ref.pIsUseElectron = true;
        ref.pIsUseMacCocoEngine = false;
        console.log('============= must first load [end]=================');
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return ref
};

// Auto install base native Engine
$bc_$1 = __auto($bc_$1);

// Define some common function for old app
// 定位文件/目录
$bc_$1.cb_revealInFinder = null; // 选择定位文件的回调
$bc_$1.revealInFinder = function (path, cb) {
  path = path || '';
  path = path.trim();
  if ($bc_$1.pN && path !== '') {
    try {
      $bc_$1.pN.window.revealInFinder(JSON.stringify({
        callback: $bc_$1._get_callback(function (obj) {
          cb && cb(obj);
        }, false),
        filePath: path
      }));
    } catch (e) {
      console.error(e);
    }
  } else if (!$bc_$1.pN) {
    alert('启动定位路径功能');
  }
};

// 预览文件
$bc_$1.previewFile = function (paramOptions, cb) {
  if ($bc_$1.pN) {
    try {
      var params = paramOptions || {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$1._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || '';

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      $bc_$1.pN.window.previewFile(JSON.stringify(params));
    } catch (e) {
      console.error(e);
    }
  } else {
    alert('启动内置预览文件功能');
  }
};

// 检测是否支持本地存储
$bc_$1.check_supportHtml5Storage = function () {
  try {
    return 'localStorage' in window && window['localStorage'] != null
  } catch (e) {
    return false
  }
};

// 初始化默认的Manifest文件, callback 必须定义才有效
$bc_$1.defaultManifest_key = 'js_defaultManifest_key';
$bc_$1.defaultManifest = {};

// 保存默认Manifest对象
$bc_$1.saveDefaultManifest = function (newManifest) {
  if (!$bc_$1.check_supportHtml5Storage()) { return false }
  var obj = {
    manifest: newManifest || $bc_$1.defaultManifest
  };
  var encoded = JSON.stringify(obj);
  try {
    window.localStorage.setItem($bc_$1.defaultManifest_key, encoded);
  } catch (error) {
    console.error(error);
  }

  return true
};

// 还原默认Manifest对象
$bc_$1.revertDefaultManifest = function () {
  try {
    if (!$bc_$1.check_supportHtml5Storage()) { return false }
    var encoded = window.localStorage.getItem($bc_$1.defaultManifest_key);
    if (encoded != null) {
      var obj = JSON.parse(encoded);
      $bc_$1.defaultManifest = obj.manifest;
    }
  } catch (error) {
    console.error(error);
  }

  return true
};

$bc_$1.getJQuery$ = function () {
  try {
    var $ = window.jQuery || window.$ || undefined;
    console.assert(_$3.isObject($), 'Must be loaded jQuery library first \n');
    return $
  } catch (error) {
    console.error(error);
  }
};

//
// -----------------------------------------------
var common = $bc_$1;

var _$4 = underscore._;

var $bc_$2 = common;
// IAP 非本地模拟
$bc_$2.IAP_SE_KEY = 'RSSDK_SE_SANBOX_IAP';
$bc_$2.IAP_SE_OBJ = {};
$bc_$2.IAP_SE_Wrapper = {
  _caller: 0,
  productIdentifiers: [],   // 商品的ID 数组
  caller: function () { // 消息回调处理
    if (this._caller === 0) {
      var $ = common.getJQuery$();
      this._caller = _$4.isUndefined($) ? (new Observable()) : $.Callbacks();
    }
    return this._caller
  }
};

// IAP 功能封装
$bc_$2.cb_handleIAPCallback = null; // IAP的回调函数
$bc_$2.IAP = {
  _pNoticeCenter: 0,
  NoticeCenter: function () {
    if (this._pNoticeCenter === 0) {
      var $ = common.getJQuery$();
      this._pNoticeCenter = _$4.isUndefined($) ? (new Observable()) : $.Callbacks();
    }
    return this._pNoticeCenter
  }, // 参照Jquery.Callbacks消息回调处理。增加动态注册监控信息的回调处理。是一种扩展
  MessageType: (function () { // 开放内核中的消息
    var msg = [
      // /{常用购买流程}
      'ProductsLoaded',
      'ProductBuyFailed',
      'ProductPurchased',
      'ProductPurchaseFailed',
      'ProductPurchaseFailedDetail',
      'ProductRequested',
      'ProductCompletePurchased',

      // /{恢复购买部分}
      'ProductsPaymentQueueRestoreCompleted',
      'ProductsPaymentRestoreCompletedTransactionsFailed',
      'ProductsPaymentRemovedTransactions',
      'ProductsPaymentUpdatedDownloads'
    ];

    var obj = {};
    var i = 0;
    for (i = 0; i < msg.length; ++i) {
      var msgType = msg[i];
      obj[msgType] = msgType;
    }

    return obj
  })(),

  data: {
    // / 产品信息是否发送请求核实并得到同步信息过。IAP机制
    productIsRequested: false,

    // / 内置产品Map
    productInfoMap: {},
    // / 内置的产品信息List
    productInfoList: [],

    // /Methods
    reInit: function () { // / 核心重新初始化
      var t$ = this;
      t$.productIsRequested = false;
      t$.productInfoMap = {};
      t$.productInfoList = [];
    },
    getProductObj: function (productIdentifier) { // / 获取商品对象
      var t$ = this;
      var obj = null;
      if (t$.productInfoMap[productIdentifier]) {
        obj = t$.productInfoMap[productIdentifier];
      }
      return obj
    },
    getPrice: function (productIdentifier) {
      var t$ = this;
      var obj = t$.getProductObj(productIdentifier);
      if (obj) {
        return obj.price
      }

      return null
    },
    getDescription: function (productIdentifier) {
      var t$ = this;
      var obj = t$.getProductObj(productIdentifier);
      if (obj) {
        return obj.description
      }

      return null
    }

  },

  // ///////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////
  // / 获取本地配置是否可以使用IAP。参见：project.json
  getEnable: function () {
    if ($bc_$2.pN) {
      try {
        return $bc_$2.pN.app.getIAPEnable()
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log('Romanysoft SDK simulation environment....');
      try {
        var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY);
        if (!obj) {
          window.localStorage.setItem($bc_$2.IAP_SE_KEY, JSON.stringify($bc_$2.IAP_SE_OBJ));
        } else {
          $bc_$2.IAP_SE_OBJ = JSON.parse(obj);
        }

        return true // 非本地环境返回True，方便测试
      } catch (error) {
        console.error(error);
      }
    }
    return false
  },

  enableIAP: function (paramOptions, cb) {
    var t$ = this;

    try {
      var params = {};
      params['cb_IAP_js'] = paramOptions['cb_IAP_js'] || $bc_$2._get_callback(function (obj) {
        // ////////////////////////内部处理//////////////////////////////////
        try {
          if (_$4.isObject(obj)) {
            var info = obj.info;
            var notifyType = obj.notifyType;

            if (notifyType === t$.MessageType['ProductRequested']) {
              if (typeof info === 'string') {
                info = JSON.parse(info);
              }

              t$.data.productIsRequested = true;
              t$.data.productInfoList = info;

              _$4.each(t$.data.productInfoList, function (product, index, list) {
                t$.data.productInfoMap[product.productIdentifier] = {
                  productIdentifier: product.productIdentifier, // 商品ID
                  description: product.description || '', // 商品描述
                  buyUrl: product.buyUrl || '', // 外部购买链接
                  price: product.price || '' // 价格
                };
              });
            }
          }
        } catch (e) {
          console.error(e);
        }

        try {
          $bc_$2.IAP.NoticeCenter().fire(obj);
        } catch (e) {}

        // /////////////////////////外部处理/////////////////////////////////
        if (_$4.isFunction($bc_$2.cb_handleIAPCallback)) {
          $bc_$2.cb_handleIAPCallback && $bc_$2.cb_handleIAPCallback(obj);
        } else {
          cb && cb(obj);
        }

        // ////////////////////////////////////////////////////////////////
      }, true);

      // / 数据校验
      console.assert(_$4.isString(params['cb_IAP_js']) === true, 'must be function string');

      // /Ian(原先的方式)
      if (_$4.isArray(paramOptions['productIds'])) {
        params['productIds'] = paramOptions['productIds'] || [];
      }

      // /Ian 2016.12.06 现在的方式. 支持更高级的商品属性定义传入
      params['products'] = [];
      if (_$4.isArray(paramOptions['products'])) { // [{productIdentifier, description, buyUrl, price}]
        try {
          var productIds = [];
          _$4.each(paramOptions['products'], function (product, index, list) {
            productIds.push(product.productIdentifier);
          });

          if (_$4.isUndefined(params['productIds'] || _$4.isNull(params['productIds']))) {
            params['productIds'] = productIds;
          }

          params['products'] = paramOptions['products'];
        } catch (e) {
          console.error(e);
          alert(e);
        }
      }

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$2.pN) {
        // 注册IAP回调
        $bc_$2.pN.iap.regeditIAPCallbackJs(params.cb_IAP_js);

        // 注册IAPBundle
        $bc_$2.pN.iap.regeditIAPCore(JSON.stringify({
          path: $bc_$2.getAppPluginDir() + $bc_$2.pIAPPlugin.path
        }));

        // 看看是否可以购买
        if ($bc_$2.pN.iap.canMakePayments()) {
          // 启动服务
          $bc_$2.pN.iap.startIAPService();

          // 发送商品请求
          $bc_$2.pN.iap.requestProducts(JSON.stringify({
            productIdentifiers: params.productIds || [],
            products: params['products'] || []
          }));
        }

 // / 以下是Demo 处理

        // /注册模拟IAP回调
        $bc_$2.IAP_SE_Wrapper.caller().add(function (obj) {
          console.assert(_$4.isString(params.cb_IAP_js) === true, 'must be function string');

          var fnc = window.eval(params.cb_IAP_js);
          if (_$4.isFunction(fnc)) {
            fnc && fnc(obj);
          }
        });

        // /注册商品ID
        $bc_$2.IAP_SE_Wrapper.productIdentifiers = params.productIds || [];

        var productsInfo = [];
        _$4.each(params.productIds, function (id, index, list) {
          var productObj = {
            productIdentifier: id,
            description: 'Plugin Description and price demo for ' + id,
            buyUrl: '',
            price: '$0.99'
          };

          productsInfo.push(productObj);
        });

        // /模拟发送获取产品信息
        $bc_$2.IAP_SE_Wrapper.caller().fire({
          notifyType: t$.MessageType.ProductRequested,
          info: productsInfo
        });
      }
    } catch (e) {
      console.error(e);
    }
  },

  _rebuildInfo: function () { // 重新构建
    var t$ = this;

    try {
      if ($bc_$2.pN) {
        $bc_$2.pN.iap.resetAll();
      } else {
        window.localStorage.removeItem($bc_$2.IAP_SE_KEY);
      }

      t$.data.reInit();
    } catch (e) {}
  },
  _check: function (productIdentifier) { // 验证数据
    var t$ = this;

    var checkFalse = _$4.isUndefined(productIdentifier) || _$4.isNull(productIdentifier);
    // 检测必须的参数
    console.assert(checkFalse === false, 'productIdentifier 必须赋值');
    // 产品必须已经注册过
    var isExists = t$.data.productInfoMap.hasOwnProperty(productIdentifier);
    console.assert(isExists === true, '指定的productIdentifier 必须已经注册，通过EnableIAP注册接口');

    if (!isExists) {
      var msg = 'Product [' + productIdentifier + "] is not registered... please see 'EnableIAP' function";
      alert(msg);
    }

    return isExists
  },

  /**
   * 恢复购买操作
   * @param successCallback 恢复成功后的回调, 传值参数为上的商品列表[{标识及数量}]，和消息内容
   * @param failCallback 恢复失败后的回调。原失败的内容
   */
  restore: function (successCallback, failCallback) {
    var t$ = this;

    // ////////////////////////////////////////////////////////////////////////////
    var _cb = function (obj) {
      try {
        $bc_$2.IAP.NoticeCenter().remove(_cb);
        if (_$4.isObject(obj)) {
          var info = obj.info;
          var notifyType = obj.notifyType;

          if (notifyType === t$.MessageType['ProductsPaymentQueueRestoreCompleted']) {
            successCallback && successCallback(info);
          } else if (t$.MessageType['ProductsPaymentRestoreCompletedTransactionsFailed']) {
            failCallback && failCallback(info, obj);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    // 注册一个消息回调
    $bc_$2.IAP.NoticeCenter().add(_cb);

    if ($bc_$2.pN) {
      // 发送购买请求
      $bc_$2.pN.iap.restoreIAP();
    } else {
      console.log('Romanysoft SDK simulation environment....');
      var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY);
      if (obj) {
        $bc_$2.IAP_SE_OBJ = JSON.parse(obj);
      }

      var purchasedItemList = []; // 声明原先已经购买的商品列表

      // /检测所有已经注册的ID
      _$4.each($bc_$2.IAP_SE_Wrapper.productIdentifiers, function (productID, index, list) {
        if ($bc_$2.IAP_SE_OBJ.hasOwnProperty(productID)) {
          var quantity = $bc_$2.IAP_SE_OBJ[productID];
          if (quantity > 0) {
            var purchasedItem = {
              productIdentifier: productID,
              quantity: quantity
            };

            purchasedItemList.push(purchasedItem);
          }
        }
      });

      // /模拟发送获取产品信息
      $bc_$2.IAP_SE_Wrapper.caller().fire({
        notifyType: t$.MessageType['ProductsPaymentQueueRestoreCompleted'],
        info: purchasedItemList
      });
    }
  },

  /**
   * 购买商品
   * @param params {} 参数productIdentifier： 购买的商品唯一标识， quantity： 购买的商品数量
   * @param successCallback 购买成功后的回调, 传值参数为商品标识，和消息内容
   * @param failCallback 购买失败后的回调，传值参数为商品标识，和消息内容
   */
  buyProduct: function (params, successCallback, failCallback) {
    var t$ = this;
    if (!t$._check(params.productIdentifier)) { return }

    // ////////////////////////////////////////////////////////////////////////////
    var _cb = function (obj) {
      try {
        $bc_$2.IAP.NoticeCenter().remove(_cb);
        if (_$4.isObject(obj)) {
          var info = obj.info;
          var notifyType = obj.notifyType;

          if (info.productIdentifier === params.productIdentifier) {
            if (notifyType === t$.MessageType['ProductPurchased']) {
              successCallback && successCallback(info.productIdentifier, obj);
            } else if (t$.MessageType['ProductPurchaseFailed']) {
              failCallback && failCallback(info.productIdentifier, obj);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    // 注册一个消息回调
    $bc_$2.IAP.NoticeCenter().add(_cb);

    if ($bc_$2.pN) {
      // 发送购买请求
      $bc_$2.pN.iap.buyProduct(JSON.stringify({
        identifier: params.productIdentifier,
        quantity: params.quantity || 1
      }));
    } else {
      console.log('Romanysoft SDK simulation environment....');
      var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY) || JSON.stringify({});

      $bc_$2.IAP_SE_OBJ = JSON.parse(obj);
      var orgQuantity = 0;
      var saveQuantity = 0;
      if ($bc_$2.IAP_SE_OBJ[params.productIdentifier]) {
        orgQuantity = $bc_$2.IAP_SE_OBJ[params.productIdentifier];
        saveQuantity = orgQuantity + params.quantity || 1;
      } else {
        saveQuantity = params.quantity || 1;
      }

      $bc_$2.IAP_SE_OBJ[params.productIdentifier] = saveQuantity;
      window.localStorage.setItem($bc_$2.IAP_SE_KEY, JSON.stringify($bc_$2.IAP_SE_OBJ));

      // 模拟发送成功购买信息
      $bc_$2.IAP_SE_Wrapper.caller().fire({
        notifyType: t$.MessageType['ProductPurchased'],
        info: {
          productIdentifier: params.productIdentifier,
          quantity: saveQuantity
        }
      });

      // 模拟发送购买完成信息
      $bc_$2.IAP_SE_Wrapper.caller().fire({
        notifyType: t$.MessageType['ProductCompletePurchased'],
        info: {
          productIdentifier: params.productIdentifier,
          transactionId: 'transactionId' + Math.round(999),
          receipt: 'receipt' + Math.round(999)
        }
      });
    }
  },

  getPrice: function (productIdentifier) {
    var t$ = this;
    if (!t$._check(productIdentifier)) { return }

    if ($bc_$2.pN) {
      if ($bc_$2.App.getSandboxEnable()) {
        return $bc_$2.pN.iap.getPrice(productIdentifier)
      } else {
        return t$.data.getPrice(productIdentifier)
      }
    } else {
      console.log('Romanysoft SDK simulation environment....');
      return t$.data.getPrice(productIdentifier)
    }
  },

  getUseableProductCount: function (productIdentifier) {
    var t$ = this;
    if (!t$._check(productIdentifier)) { return }

    if ($bc_$2.pN) {
      return $bc_$2.pN.iap.getUseableProductCount(productIdentifier) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....');
      var quantity = 0;

      var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY) || JSON.stringify({});
      if (obj) {
        $bc_$2.IAP_SE_OBJ = JSON.parse(obj);
        quantity = $bc_$2.IAP_SE_OBJ[productIdentifier] || 0;
      }

      return quantity
    }
  },

  setUseableProductCount: function (jsonObj) {
    var t$ = this;
    if (!t$._check(jsonObj.productIdentifier)) { return }

    if ($bc_$2.pN) {
      var params = {
        identifier: jsonObj.productIdentifier || '',
        quantity: jsonObj.quantity || 1
      };
      return $bc_$2.pN.iap.setUseableProductCount(JSON.stringify(params)) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....');
      var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY) || JSON.stringify({});
      if (obj) {
        $bc_$2.IAP_SE_OBJ = JSON.parse(obj);

        var saveQuantity = jsonObj.quantity || 1;
        $bc_$2.IAP_SE_OBJ[jsonObj.productIdentifier] = saveQuantity;
        window.localStorage.setItem($bc_$2.IAP_SE_KEY, JSON.stringify($bc_$2.IAP_SE_OBJ));
        return saveQuantity || 0
      }
    }

    return 0
  },

  add1Useable: function (productIdentifier) {
    var t$ = this;
    if (!t$._check(productIdentifier)) { return }

    if ($bc_$2.pN) {
      return $bc_$2.pN.iap.add1Useable(productIdentifier) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....');
      var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY) || JSON.stringify({});
      if (obj) {
        $bc_$2.IAP_SE_OBJ = JSON.parse(obj);

        var orgQuantity = 0;
        var saveQuantity = 0;
        if ($bc_$2.IAP_SE_OBJ[productIdentifier]) {
          orgQuantity = $bc_$2.IAP_SE_OBJ[productIdentifier] || 0;
          saveQuantity = orgQuantity + 1;
        }

        $bc_$2.IAP_SE_OBJ[productIdentifier] = saveQuantity;
        window.localStorage.setItem($bc_$2.IAP_SE_KEY, JSON.stringify($bc_$2.IAP_SE_OBJ));

        return saveQuantity
      }
    }

    return 0
  },

  sub1Useable: function (productIdentifier) {
    var t$ = this;
    if (!t$._check(productIdentifier)) { return }

    if ($bc_$2.pN) {
      return $bc_$2.pN.iap.sub1Useable(productIdentifier) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....');
      var obj = window.localStorage.getItem($bc_$2.IAP_SE_KEY) || JSON.stringify({});
      if (obj) {
        $bc_$2.IAP_SE_OBJ = JSON.parse(obj);

        var orgQuantity = 0;
        var saveQuantity = 0;
        if ($bc_$2.IAP_SE_OBJ[productIdentifier]) {
          orgQuantity = $bc_$2.IAP_SE_OBJ[productIdentifier];
          saveQuantity = orgQuantity - 1;
        }

        saveQuantity = saveQuantity > 0 ? saveQuantity : 0;
        $bc_$2.IAP_SE_OBJ[productIdentifier] = saveQuantity;
        window.localStorage.setItem($bc_$2.IAP_SE_KEY, JSON.stringify($bc_$2.IAP_SE_OBJ));

        return saveQuantity
      }
    }

    return 0
  }
};

//
// -----------------------------------------------
var iap = $bc_$2;

var $bc_$3 = common;

/**
 * Notice 内容封装
 */
$bc_$3.Notice = {
  alert: function (jsonObj) {
    if ($bc_$3.pN) {
      var params = {
        message: jsonObj.message || 'Tip',
        title: jsonObj.title || 'Information',
        buttons: jsonObj.buttons || ['Ok'],
        alertType: jsonObj.alertType || 'Alert'
      };

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key];
        }
      }

      var returnValue = $bc_$3.pN.notice.alert(JSON.stringify(params));

      // /Fixed: 根据Electron及本地引擎的区别来处理返回的值
      if ($bc_$3.pIsUseElectron) {
        return returnValue
      } else if ($bc_$3.pIsUseMacCocoEngine) {
        /**
            enum {
                NSAlertDefaultReturn = 1,
                NSAlertAlternateReturn = 0,
                NSAlertOtherReturn = -1,
                NSAlertErrorReturn = -2
            };
          */

        if (returnValue === 1) { return 0 }
        if (returnValue === 0) { return 1 }
        if (returnValue === -1) { return 2 }
        if (returnValue === -2) { return 3 }
      }
    } else {
      alert(jsonObj.message);
    }
  },

  notify: function (jsonObj, cb) {
    if ($bc_$3.pN) {
      var params = {
        content: jsonObj.message || 'Tip',
        title: jsonObj.title || 'title',
        callback: jsonObj['callback'] || $bc_$3._get_callback(function (obj) {
          cb && cb(obj);
        }, true)
      };

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key];
        }
      }

      return $bc_$3.pN.notice.notify(JSON.stringify(params))
    } else {
      alert(jsonObj.message);
    }
  },

  dockMessage: function (jsonObj, cb) {
    if ($bc_$3.pN) {
      var params = {
        content: jsonObj.message || 'Tip',
        title: jsonObj.title || 'title',
        callback: jsonObj['callback'] || $bc_$3._get_callback(function (obj) {
          cb && cb(obj);
        }, true)
      };

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key];
        }
      }

      if ($bc_$3.pIsUseElectron) {
        if (window.Notification) {
          // 参照HTML5 Notification API
          // http://electron.atom.io/docs/v0.37.8/tutorial/desktop-environment-integration/
          var _notification = new window.Notification(params.title, {
            body: params.content
          });
          _notification.onclick = function () {
            params.callback && params.callback();
          };
        }
      } else {
        return $bc_$3.pN.growl.notify(JSON.stringify(params))
      }
    } else {
      alert(jsonObj.message);
    }
  }
};

// -----------------------------------------------
var notice = $bc_$3;

var $bc_$4 = common;
/**
 * App 内容封装
 */
$bc_$4.App = {
  // 获得App的名称
  appName: null,
  getAppName: function () {
    if ($bc_$4.pN) {
      var t = this;
      if (t.appName) { return t.appName }
      t.appName = $bc_$4.pN.app.getAppName();
      return t.appName
    }
    return 'AppName'
  },

  // 获得产品的版本
  appVersion: null,
  getAppVersion: function () {
    if ($bc_$4.pN) {
      var t = this;
      if (t.appVersion) { return t.appVersion }
      t.appVersion = $bc_$4.pN.app.getAppVersion();
      return t.appVersion
    }
    return '4.5.6'
  },

  // 获得产品的构建包的版本
  appBuildVersion: null,
  getAppBuildVersion: function () {
    if ($bc_$4.pN) {
      var t = this;
      if (t.appBuildVersion) { return t.appBuildVersion }
      t.appBuildVersion = $bc_$4.pN.app.getAppBuildVersion();
      return t.appBuildVersion
    }
    return '201506271454'
  },

  // 获得产品的ID
  appId: null,
  getAppId: function () {
    if ($bc_$4.pN) {
      var t = this;
      if (t.appId) { return t.appId }
      t.appId = $bc_$4.pN.app.getAppIdentifier();
      return t.appId
    }
    return 'AppID'
  },

  // 获取启动的时候进程附带的参数
  getAppArgv: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getAppArgv()
    }

    return []
  },

  // 获得产品的运行的操作系统及平台
  sysOS: null,
  getAppRunOnOS: function () {
    if ($bc_$4.pN && !$bc_$4.pIsUseMacCocoEngine) {
      var t = this;
      if (t.sysOS) { return t.sysOS }
      t.sysOS = $bc_$4.pN.app.getAppRunOnOS();
      return t.sysOS
    }
    return 'MacOSX' // 原生返回MacOSX，其他的参照Electron
  },

  // 获得App是否在沙盒内
  getSandboxEnable: function () {
    if ($bc_$4.pN) {
      var sandboxEnable = $bc_$4.pN.app.getSandboxEnable();
      return sandboxEnable
    }
    return false
  },

  // 获取App是否已经注册
  getIsRegistered: function () {
    var t$ = this;
    if ($bc_$4.pN) {
      if (t$.getSandboxEnable()) { return true }
      return $bc_$4.pN.app.getIsRegistered()
    }
    return false
  },

  // 获取App内部注册信息
  getRegInfoJSONString: function () {
    if ($bc_$4.pN) {
      var str = $bc_$4.pN.app.getRegInfoJSONString();
      return str
    }
    return ''
  },

  // 获取App认证的内部序列号信息
  getSerialNumber: function () {
    try {
      if ($bc_$4.pN) {
        var str = $bc_$4.pN.app.getStringSerialNumber();
        return str
      }
    } catch (e) {
      console.error(e);
    }

    return ''
  },

  // 获取本地IP地址
  getLocalIP: function () {
    if ($bc_$4.pN) {
      var str = $bc_$4.pN.app.getLocalIP();
      return str
    }
    return ''
  },

  // 终止运行，退出系统
  terminate: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.terminate();
    }
  },

  // 重启启动，先退出，然后重新启动
  relaunch: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.relaunch();
    }
  },

  // 激活自己
  activate: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.activate();
    }
  },

  // 隐藏自己
  hide: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.hide();
    }
  },

  // 取消隐藏自己
  unhide: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.unhide();
    }
  },

  // 发出beep声音
  beep: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.beep();
    }
  },

  // 激活Bounce事件
  bounce: function () {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.bounce();
    }
  },

  // 打开链接地址
  open: function (data) {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.open(data || 'http://www.baidu.com')
    } else {
      try {
        window.open(data);
      } catch (e) {}
    }
  },

  // 打开文件，使用系统默认行为
  openFileWithDefaultApp: function (filePath) {
    if ($bc_$4.pN) {
      var _path = filePath || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      $bc_$4.pN.app.openFile(_path);
    }
  },

  // 通过应用程序的名称，启动应用程序
  launchApplication: function (applicationName) {
    if ($bc_$4.pN) {
      $bc_$4.pN.app.launch(applicationName || 'Safari'); // Safari.app
    }
  },

  // 发送电子邮件
  sendEmail: function (jsonObj) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['sendAddress'] = jsonObj['sendAddress'] || 'admin@gmail.com';
        params['toAddress'] = jsonObj['toAddress'] || 'admin@gmail.com';
        params['subject'] = jsonObj['subject'] || 'Hello';
        params['body'] = jsonObj['body'] || 'Hello!!';

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.app.sendEmailWithMail(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动发送邮件');
    }
  },

  // {开启启动部分}
  // 是否开启自动启动{苹果商店App 无效}
  isStartAtLogin: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.isStartAtLogin()
    }

    return false
  },

  // 开启自动启动功能{苹果商店App 无效}
  setStartAtLogin: function (enable) {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.setStartAtLogin(enable) // 备注：沙盒状态下无效
    }
  },

  // {NSUserDefaults}
  // 存储信息{key: value: }方式,Map方式
  setInfoToUserDefaults: function (jsonObj) {
    if ($bc_$4.pN) {
      var obj = jsonObj || {
        callback: 'console.log',
        key: '',
        value: ''
      };

      // 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          obj[key] = jsonObj[key];
        }
      }

      $bc_$4.pN.window.setInfoToUserDefaults(JSON.stringify(obj));
    }
  },
  // 获取存储信息{key: value: }方式,Map方式
  getInfoFromUserDefaults: function (jsonObj) {
    if ($bc_$4.pN) {
      var obj = jsonObj || {
        callback: 'console.log',
        key: ''
      };

      // 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          obj[key] = jsonObj[key];
        }
      }

      $bc_$4.pN.window.getInfoFromUserDefaults(JSON.stringify(obj));
    }
  },
  // 移除存储信息{key: value: }方式,Map方式
  removeItemFromUserDefaults: function (jsonObj) {
    if ($bc_$4.pN) {
      var obj = jsonObj || {
        callback: 'console.log',
        key: ''
      };
      // 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          obj[key] = jsonObj[key];
        }
      }

      $bc_$4.pN.window.removeItemFromUserDefaults(JSON.stringify(obj));
    }
  },

  // {方便函数，设置评价App功能是否开启}
  setOptions_RateAppClose: function (enable) {
    $bc_$4.App.setInfoToUserDefaults({
      key: 'RateApp_CLOSE',
      value: enable
    });
  },

  // {获取开通的服务器端口}
  getServerPort: function () {
    var default_port = 8888;
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getHttpServerPort() || default_port
    }

    return default_port
  },

  // 获得App的插件目录
  getAppPluginDir: $bc_$4.getAppPluginDir = function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appPluginDirPath()
    }
    return ''
  },

  // 获得Application的Resource目录
  getAppResourceDir: $bc_$4.getAppResourceDir = function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.resource()
    }
    return ''
  },

  // 获得Public目录
  getAppResourcePublicDir: $bc_$4.getAppResourcePublicDir = function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.resource() + '/public'
    }
    return ''
  },

  // 获得App的包的目录
  getAppBundlePath: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.application()
    }
    return ''
  },

  // 获得AppDataHomeDir
  getAppDataHomeDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appDataHomeDir()
    }
    return ''
  },

  // 获得Home Directory
  getHomeDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.homeDir()
    }
    return ''
  },

  // 获得DocumentsDir
  getDocumentsDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.documentsDir()
    }
    return ''
  },

  // 获得本地Documents目录
  getLocalDocumentsDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localDocumentsDir()
    }
    return ''
  },

  // 获得LibraryDir
  getLibraryDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.libraryDir()
    }
    return ''
  },

  // 获得临时目录
  getTempDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.tempDir()
    }
    return ''
  },

  // 获得Cache目录
  getCacheDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.cacheDir()
    }
    return ''
  },

  // 获得Application目录
  getApplicationDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.applicationDir()
    }
    return ''
  },

  // 获得DesktopDir，桌面路径
  getDesktopDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.desktopDir()
    }
    return ''
  },

  // 获得downloadDir，下载目录路径
  getDownloadDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.downloadDir()
    }
    return ''
  },

  // 获得本地download目录路径
  getLocalDownloadDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localDownloadDir()
    }
    return ''
  },

  // 获得本地desktop目录路径
  getLocalDesktopDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localDesktopDir()
    }
    return ''
  },

  // 获得本地Library目录路径
  getLocalLibraryDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localLibraryDir()
    }
    return ''
  },

  // 获得Movies目录路径
  getMoviesDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.moviesDir()
    }
    return ''
  },

  // 获得本地Movies目录路径
  getLocalMoviesDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localMoviesDir()
    }
    return ''
  },

  // 获得Music目录
  getMusicDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.musicDir()
    }
    return ''
  },

  // 获得本地Music目录
  getLocalMusicDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localMusicDir()
    }
    return ''
  },

  // 获得Pictures目录
  getPicturesDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.picturesDir()
    }
    return ''
  },

  // 获得本地Pictures目录
  getLocalPicturesDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.localPicturesDir()
    }
    return ''
  },

  // 获得UserName
  getUserName: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.userName()
    }
    return ''
  },

  // 获得User全名(UserFullName)
  getUserFullName: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.userFullName()
    }
    return ''
  },

  // 获得沙盒状态下可写入的Documents路径
  getWritableDocumentsDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appWriteableDocumentDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Download路径
  getWritableDownloadDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appWriteableDownloadDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Music路径
  getWritableMusicDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appWriteableMusicDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Movies路径
  getWritableMoviesDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appWriteableMoviesDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Pictures路径
  getWritablePicturesDir: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.appWriteablePicturesDir()
    }
    return ''
  },

  // 检测路径是否存在
  checkPathIsExist: $bc_$4.pathIsExist = function (path) {
    if (path.trim() === '') { return false }

    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.pathIsExist(_path)
    }

    return true
  },

  // 文件是否为0Byte
  checkFileIsZero: $bc_$4.checkFileIsZeroSize = function (file_path) {
    if (file_path.trim() === '') { return false }

    if ($bc_$4.pN) {
      var _path = file_path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.fileIsZeroSize(_path)
    }

    return false
  },

  // 路径是否可以写
  checkPathIsWritable: $bc_$4.checkPathIsWritable = function (path) {
    if (path.trim() === '') { return false }

    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.checkPathIsWritable(_path)
    }

    return true
  },

  // 创建空文件
  createEmptyFile: $bc_$4.createEmptyFile = function (file_path, cb) {
    if ($bc_$4.pN) {
      var _path = file_path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.window.createEmptyFile(JSON.stringify({
        path: _path,
        callback: $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true)
      }))
    }
  },

  // 创建目录
  createDir: $bc_$4.createDir = function (dir_path, atts, cb) {
    if ($bc_$4.pN) {
      try {
        var params = {};
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['path'] = dir_path || ($bc_$4.pN.path.tempDir() + 'tmp_dir001');
        if (atts) { params['atts'] = atts || {}; }

        $bc_$4.pN.window.createDir(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 删除文件
  removeFile: $bc_$4.removeFile = function (file_path, cb) {
    if ($bc_$4.pN) {
      var _path = file_path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.window.removeFile(JSON.stringify({
        path: _path,
        callback: $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true)
      }))
    }
  },

  // 删除目录
  removeDir: $bc_$4.removeDir = function (dir_path, cb) {
    if ($bc_$4.pN) {
      try {
        var params = {};
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['path'] = dir_path || ($bc_$4.pN.path.tempDir() + '/tmp_dir001');

        $bc_$4.pN.window.removeDir(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 拷贝文件
  copyFile: $bc_$4.copyFile = function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['src'] = jsonObj['src'] || '';
        params['dest'] = jsonObj['dest'] || '';

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.window.copyFile(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 拷贝目录
  copyDir: $bc_$4.copyDir = function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['src'] = jsonObj['src'] || '';
        params['dest'] = jsonObj['dest'] || '';

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.window.copyDir(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 移动文件
  moveFile: $bc_$4.moveFile = function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['src'] = jsonObj['src'] || '';
        params['dest'] = jsonObj['dest'] || '';

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.window.moveFile(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 移动目录
  moveDir: $bc_$4.moveDir = function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['src'] = jsonObj['src'] || '';
        params['dest'] = jsonObj['dest'] || '';

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.window.moveDir(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 查找文件是否在此目录中存在
  findFile: $bc_$4.findFile = function (dir, fileName, cbName, cb) {
    if ($bc_$4.pN) {
      var _dir = dir || $bc_$4.pN.path.tempDir();
      var _fileName = fileName || 'tmp.txt';

      var params = {
        callback: cbName || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true),
        dir: _dir,
        fileName: _fileName
      };

      return $bc_$4.pN.window.findFile(JSON.stringify(params))
    }

    return null
  },

  // 判断路径是否可读
  checkPathIsReadable: function (path) {
    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.checkPathIsReadable(_path)
    }

    return false
  },

  // 判断路径是否可运行
  checkPathIsExecutable: function (path) {
    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.checkPathIsExecutable(_path)
    }

    return false
  },

  // 判断路径是否可删除
  checkPathIsDeletable: function (path) {
    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.checkPathIsDeletable(_path)
    }

    return false
  },

  // 判断是否为文件
  checkPathIsFile: function (path) {
    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.checkPathIsFile(_path)
    }

    return false
  },

  // 判断是否为目录
  checkPathIsDir: function (path) {
    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.checkPathIsDir(_path)
    }

    return false
  },

  getFileName: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.path.getFileName(_path)
    }

    return ''
  },

  // 获取文件扩展名
  getFileExt: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.path.getFileExt(_path)
    }

    return ''
  },

  // 获取文件名称，不带扩展名
  getFileNameWithoutExt: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.path.getFileNameWithoutExt(_path)
    }

    return ''
  },

  // 获取路径上一级目录路径
  getPathParentPath: function (path) {
    if ($bc_$4.pN) {
      var _path = path || $bc_$4.pN.path.tempDir();
      return $bc_$4.pN.path.getPathParentPath(_path)
    }

    return ''
  },

  // 获取文件的基本属性
  getFilePropertyJSONString: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.path.getFilePropertyJSONString(_path)
    }

    return ''
  },

  // 获取文件或目录的系统图标路径，返回的是png方式
  getFileOrDirIconPath: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.path.getFileOrDirIconPath(_path)
    }

    return ''
  },

  // 获取临时文件的路径
  getNewTempFilePath: function (fileName) {
    if ($bc_$4.pN) {
      return $bc_$4.pN.path.getNewTempFilePath(fileName || 'rs.txt') // fileName 文件名称
    }

    return ''
  },

  // 获取其他App的基本信息
  /**
   *
   * @param path 路径
   * @param cb   回调函数
   * 返回的值的样例：
   *
   */
  getOtherAppInfo: function (path, cb) {
    if ($bc_$4.pN) {
      try {
        var params = {};
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['path'] = path || ($bc_$4.pN.path.tempDir() + '/tmp_dir001');

        return $bc_$4.pN.window.getOtherAppInfo(JSON.stringify(params))
      } catch (e) {
        console.error(e);
      }
    }

    return ''
  },

  /**
   * 获取格式化后的字符串。主要是用动态变量来处理
   * 支持如下变量：
   * ${HOME}
   * ${BUNDLE}
   * ${BUNDEL_RESOURCE}
   * ${BUNDEL_PLUGIN}
   * ${DOCUMENTS}
   * ${LIBRARY}
   * ${TEMP}
   * ${CACHE}
   * ${APPLICATION}
   * ${DESKTOP}
   * ${DOWNLOAD}
   * ${MOVIES}
   * ${MUSIC}
   * ${PICTURES}
   * ${APPW_DOCUMENTS}
   * ${APPW_DOWNLOAD}
   * ${APPW_MOVIES}
   * ${APPW_MUSIC}
   * ${APPW_PICTURES}
   * ${LOCAL_DESKTOP}
   * ${LOCAL_DOWNLOAD}
   * ${LOCAL_MOVIES}
   * ${LOCAL_MUSIC}
   * ${LOCAL_PICTURES}
   * ${LOCAL_LIBRARY}
   * ${LOCAL_DOCUMENTS}
   * ${USER_NAME}
   * ${USER_FULL_NAME}
   * ${APPDATA_HOME}
   * ${APP_UI_DIR}
   * ${APP_NAME}
   * ${APP_VERSION}
   * ${APP_BUILD_VERSION}
   * ${APP_ID}
   * @param str
   * @returns {*}
   */
  getUpdateEnvString: function (str) {
    if ($bc_$4.pN) {
      try {
        return $bc_$4.pN.path.getUpdateEnvString(str)
      } catch (e) {
        console.error(e);
      }
    }

    return ''
  },

  // 获得文件/目录size(实际字节数 1024)
  fileSizeAtPath: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.app.fileSizeAtPath(_path)
    }

    return ''
  },

  // 获得文件/目录占用磁盘(字节数 1000)
  diskSizeAtPath: function (path) {
    if ($bc_$4.pN) {
      var _path = path || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.app.diskSizeAtPath(_path)
    }

    return ''
  },

  // 获得文件/目录转译的容量(以1000基数，还是1024基数。 )
  getFileSizeString: function (bytes, si) {
    if ( bytes === void 0 ) bytes = 0;
    if ( si === void 0 ) si = true;

    if ($bc_$4.pN) {
      return (si ? $bc_$4.pN.app.getFileSizeString1000(bytes) : $bc_$4.pN.app.getFileSizeString1024(bytes))
    }

    return ''
  },

  // 获得字符串的md5值
  md5Digest: function (str) {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.md5Digest(str || 'testMd5')
    }

    return ''
  },

  // {扩展}
  getBuyURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getBuyURL()
    }
    return ''
  },

  getFAQURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getFAQURL()
    }
    return ''
  },

  getHomePageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getHomePageURL()
    }
    return ''
  },

  getDocumentPageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getDocumentPageURL()
    }
    return ''
  },

  getRoadmapPageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getRoadmapPageURL()
    }
    return ''
  },

  getReportIssuePageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getReportIssuePageURL()
    }
    return ''
  },

  getViewLicensePageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getViewLicensePageURL()
    }
    return ''
  },

  getReleaseNotesPageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getReleaseNotesPageURL()
    }
    return ''
  },

  getCheckForUpdatePageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getCheckForUpdatePageURL()
    }
    return ''
  },

  // 获得当前苹果操作系统本地的语言
  getAppleLanguage: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.curAppleLanguage()
    }

    return 'en-US'
  },

  // 获取兼容Google翻译的语言标识信息
  getCompatibleGoogleLanguageInfo: function () {
    var info = {
      'auto': {
        'af': 'Spoor taal',
        'sq': 'Zbulo gjuhën',
        'ar': 'الكشف عن اللغة',
        'hy': 'Հայտնաբերել լեզուն',
        'az': 'Dil aşkar',
        'eu': 'Hizkuntza atzeman',
        'be': 'Вызначыць мову',
        'bn': 'ভাষা সনাক্ত করুন',
        'bs': 'Detect jeziku',
        'bg': 'Разпознаване на езика',
        'ca': 'Detectar idioma',
        'ceb': 'Makamatikod pinulongan',
        'ny': 'azindikire chinenero',
        'zh-CN': '检测语言',
        'zh-TW': '檢測語言',
        'hr': 'Otkrij jezik',
        'cs': 'Rozpoznat jazyk',
        'da': 'Registrer sprog',
        'nl': 'Detect taal',
        'en': 'Detect language',
        'eo': 'Detekti lingvo',
        'et': 'Tuvasta keel',
        'tl': 'Alamin ang wika',
        'fi': 'Tunnista kieli',
        'fr': 'Détecter la langue',
        'gl': 'Detectar idioma',
        'ka': 'ენის განსაზღვრა',
        'de': 'Sprache erkennen',
        'el': 'Εντοπισμός γλώσσας',
        'gu': 'ભાષા શોધો',
        'ht': 'Detekte lang',
        'ha': 'Gano harshen',
        'iw': 'אתר שפה',
        'hi': 'भाषा का पता लगाने',
        'hmn': 'Ntes lus',
        'hu': 'Nyelv felismerése',
        'is': 'Greina tungumál',
        'ig': 'Ịchọpụta asụsụ',
        'id': 'Deteksi bahasa',
        'ga': 'Braith teanga',
        'it': 'Rileva lingua',
        'ja': '言語を検出',
        'jw': 'Ndeteksi basa',
        'kn': 'ಭಾಷೆಯನ್ನು ಪತ್ತೆಮಾಡಿ',
        'kk': 'тілін анықтау',
        'km': 'រក​ឃើញ​ភាសា',
        'ko': '언어 감지',
        'lo': 'ພາ​ສາ​ການ​ກວດ​ສອບ',
        'la': 'Deprehendere linguae',
        'lv': 'Noteikt valodu',
        'lt': 'Aptikti kalbą',
        'mk': 'Откривање на јазик',
        'ms': 'Kesan bahasa',
        'ml': 'ഭാഷ തിരിച്ചറിയുക',
        'mt': 'Jindunaw lingwa',
        'mi': 'Kitea te reo',
        'mr': 'भाषा शोधा',
        'mn': 'Хэл илрүүлэх',
        'my': 'ဘာသာစကား detect',
        'ne': 'भाषा पत्ता लगाउनुहोस्',
        'no': 'Detect språk',
        'fa': 'تشخیص زبان',
        'pl': 'Wykryj język',
        'pt': 'Detectar idioma',
        'pa': 'ਭਾਸ਼ਾ ਦੀ ਖੋਜਣਾ ਹੈ',
        'ma': 'ਭਾਸ਼ਾ ਖੋਜ',
        'ro': 'Detecta limbă',
        'ru': 'Определить язык',
        'sr': 'Откриј језик',
        'st': 'khona ho utloa puo',
        'si': 'භාෂාවක් අනාවරණය',
        'sk': 'Rozpoznať jazyk',
        'sl': 'Zaznaj jezik',
        'so': 'Ogaado luqadda',
        'es': 'Detectar idioma',
        'sw': 'Kuchunguza lugha',
        'sv': 'Identifiera språk',
        'tg': 'ошкор забон',
        'ta': 'மொழியைக் கண்டறி',
        'te': 'భాషను కనుగొను',
        'th': 'ตรวจหาภาษา',
        'tr': 'Dili algıla',
        'uk': 'Визначити мову',
        'ur': 'زبان کا پتہ لگانے',
        'uz': 'tilni aniqlash',
        'vi': 'Phát hiện ngôn ngữ',
        'cy': 'Canfod iaith',
        'yi': 'דעטעקט שפּראַך',
        'yo': 'Ri ede',
        'zu': 'Thola ulimi'
      },
      'local': {
        'af': 'Afrikaans',
        'sq': 'Shqiptar',
        'ar': 'العربية',
        'hy': 'Հայերեն',
        'az': 'Azərbaycan',
        'eu': 'Euskal',
        'be': 'Беларуская',
        'bn': 'বাঙ্গালী',
        'bs': 'Bosanski',
        'bg': 'Български',
        'ca': 'Català',
        'ceb': 'Cebuano',
        'ny': 'Chichewa',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'hr': 'Hrvatski',
        'cs': 'Čeština',
        'da': 'Dansk',
        'nl': 'Nederlands',
        'en': 'English',
        'eo': 'Esperanto',
        'et': 'Eesti',
        'tl': 'Pilipino',
        'fi': 'Suomi',
        'fr': 'Français',
        'gl': 'Galega',
        'ka': 'ქართული',
        'de': 'Deutsch',
        'el': 'Ελληνικά',
        'gu': 'ગુજરાતી',
        'ht': 'Kreyòl ayisyen',
        'ha': 'Hausa',
        'iw': 'עברית',
        'hi': 'हिन्दी',
        'hmn': 'Hmoob',
        'hu': 'Magyar',
        'is': 'Icelandic',
        'ig': 'Igbo',
        'id': 'Indonesia',
        'ga': 'Gaeilge',
        'it': 'Italiano',
        'ja': '日本の',
        'jw': 'Jawa',
        'kn': 'ಕನ್ನಡ',
        'kk': 'Қазақ',
        'km': 'ខ្មែរ',
        'ko': '한국의',
        'lo': 'ລາວ',
        'la': 'Latine',
        'lv': 'Latvijas',
        'lt': 'Lietuvos',
        'mk': 'Македонски',
        'ms': 'Melayu',
        'ml': 'മലയാളം',
        'mt': 'Malti',
        'mi': 'Maori',
        'mr': 'मराठी',
        'mn': 'Монгол',
        'my': 'မြန်မာ (ဗမာ)',
        'ne': 'नेपाली',
        'no': 'Norsk',
        'fa': 'فارسی',
        'pl': 'Polski',
        'pt': 'Português',
        'pa': 'ਪੰਜਾਬੀ ਦੇ',
        'ma': 'ਪੰਜਾਬੀ ਦੇ',
        'ro': 'Român',
        'ru': 'Русский',
        'sr': 'Српски',
        'st': 'Sesotho',
        'si': 'සිංහල',
        'sk': 'Slovenský',
        'sl': 'Slovenščina',
        'so': 'Somali',
        'es': 'Español',
        'sw': 'Kiswahili',
        'sv': 'Svenska',
        'tg': 'тоҷик',
        'ta': 'தமிழ்',
        'te': 'తెలుగు',
        'th': 'ไทย',
        'tr': 'Türk',
        'uk': 'Український',
        'ur': 'اردو',
        'uz': "O'zbekiston",
        'vi': 'Tiếng Việt',
        'cy': 'Cymraeg',
        'yi': 'ייִדיש',
        'yo': 'Yoruba',
        'zu': 'Zulu'
      }
    };

    return info
  },

  // 获得兼容浏览器的语言标识, 发起者，为Native
  getCompatibleWebkitLanguageList: function (_getType) {
    var getType = _getType || 'Native2Webkit'; // 获取类型，默认是获取兼容WebKit的语言标识数组

    var defaultLanguage = 'en';
    // 本地对应浏览器的语言标识
    var NativeApple2WebKitLanguageMap = {
      'Unknown': [''],
      'en': ['en', 'en-US', 'en-us'], // 英语

      'fr': ['fr', 'fr-FR', 'fr-fr'], // French (fr) 法语

      'de': ['de', 'de-DE', 'de-de'], // German (de) 德语

      'zh-Hans': ['zh', 'zh-CN', 'zh-cn', 'zh-Hans'], // Chinese (Simplified) (zh-Hans) 中文简体

      'zh-Hant': ['zh-TW', 'zh-tw', 'zh-Hant'], // Chinese (Traditional) (zh-Hant) 中文繁体

      'ja': ['ja', 'ja-JP', 'ja-jp'], // Japanese (ja) 日语

      'es': ['es', 'es-ES', 'es-es'], // Spanish (es) 西班牙语

      'es-MX': ['es-MX', 'es-XL', 'es-xl'], // Spanish (Mexico) (es-MX) 西班牙语（墨西哥）

      'it': ['it', 'it-IT', 'it-it'], // Italian (it) 意大利语

      'nl': ['nl', 'nl-NL', 'nl-nl'], // Dutch (nl) 荷兰语

      'ko': ['ko', 'ko-KR', 'ko-kr'], // Korean (ko) 韩语

      'pt': ['pt', 'pt-BR', 'pt-br'], // Portuguese (pt) 葡萄牙语

      'pt-PT': ['pt-PT', 'pt-pt'], // Portuguese (Portugal) (pt) 葡萄牙语（葡萄牙）

      'da': ['da', 'da-DK', 'da-da'], // Danish (da) 丹麦语

      'fi': ['fi', 'fi-FI', 'fi-fi'], // Finnish (fi) 芬兰语

      'nb': ['nb', 'nb-NO', 'nb-no'], // Norwegian Bokmal (nb) 挪威语

      'sv': ['sv', 'sv-SE', 'sv-se'], // Swedish (sv) 瑞典语

      'ru': ['ru', 'ru-RU', 'ru-ru'], // Russian (ru) 俄语

      'pl': ['pl', 'pl-PL', 'pl-pl'], // Polish (pl) 波兰语

      'tr': ['tr', 'tr-TR', 'tr-tr'], // Turkish (tr) 土耳其语

      'ar': ['ar', 'AR'], // Arabic (ar) 阿拉伯语

      'th': ['th', 'th-TH', 'th-th'], // Thai (th) 泰语

      'cs': ['cs', 'cs-CZ', 'cs-cz'], // Czech (cs) 捷克语

      'hu': ['hu', 'hu-HU', 'hu-hu'], // Hungarian (hu) 匈牙利语

      'ca': ['ca', 'ca-ES', 'ca-es'], // Catalan (ca) 加泰罗尼亚语

      'hr': ['hr', 'hr-HR', 'hr-hr'], // Croatian (hr) 克罗地亚语

      'el': ['el', 'el-GR', 'el-gr'], // Greek (el) 希腊语

      'he': ['he', 'he-IL', 'he-il'], // Hebrew (he) 希伯来语

      'ro': ['ro', 'ro-RO', 'ro-ro'], // Romanian (ro) 罗马尼亚语

      'sk': ['sk', 'sk-SK', 'sk-sk'], // Slovak (sk) 斯洛伐克语

      'uk': ['uk', 'uk-UA', 'uk-ua'], // Ukrainian (uk) 乌克兰语

      'id': ['id', 'ID', 'id-ID', 'id-id'], // Indonesian (id) 印尼语

      'ms': ['ms', 'MS', 'ms-MS', 'ms-ms'], // Malay (ms) 马来西亚语

      'vi': ['vi', 'vi-VN', 'vi-vn'] // Vietnamese (vi) 越南语
    };

    if (getType === 'Native2Webkit') { // 先获取Native的语言，然后查找Map
      var appleLanguage = 'en-US';
      if ($bc_$4.pN) {
        appleLanguage = $bc_$4.pN.app.curAppleLanguage();
      }

      if (NativeApple2WebKitLanguageMap.hasOwnProperty(appleLanguage)) {
        return NativeApple2WebKitLanguageMap[appleLanguage]
      }

      return NativeApple2WebKitLanguageMap[defaultLanguage]
    } else if (getType === 'webkitCompatible') {
      var mapValue = null;
      var webLanguage = navigator.language || 'en';

      var inArray = function (value, array) {
        if (Array.prototype.indexOf) {
          return array.indexOf(value)
        } else {
          for (var i = 0; i < array.length; i++) {
            if (array[i] === value) { return i }
          }
          return -1
        }
      };

      for (var key in NativeApple2WebKitLanguageMap) {
        if (NativeApple2WebKitLanguageMap.hasOwnProperty(key)) {
          var languageArray = NativeApple2WebKitLanguageMap[key];
          if (inArray(webLanguage, languageArray) > -1) {
            mapValue = languageArray;
            break
          }
        }
      }

      return mapValue
    }

    return console.error('调用方式不正确，需要的参数为:Native2Webkit 或者webkitCompatible')
  },

  // 设置用户的语言
  setUserLanguage: function (language) {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.setUserLanguage(language || 'en-US')
    }
  },

  // 获取用户设置的语言
  getUserLanguage: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.curUserLanguage()
    }

    return 'en-US'
  },

  // 截屏[整个屏幕]
  captureFull: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['filePath'] = params['filePath'] || ($bc_$4.pN.path.tempDir() +
          'cap_screen.png'); // 保存文件

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }
        $bc_$4.pN.window.capture(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 添加目录到变化监视器
  addDirPathToChangeWatcher: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};

        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileWritten"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileAttributesChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileSizeIncreased"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"AccessWasRevoked"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"LinkCountChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileRenamed"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileDeleted"} (app.js, line 270)
          cb && cb(obj);
        }, true);
        params['path'] = params['path'] || ($bc_$4.pN.path.tempDir());

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.window.createDirChangeWatcher(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 添加文件目录到变化监视器
  addFilePathToChangeWatcher: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};

        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileWritten"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileAttributesChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileSizeIncreased"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"AccessWasRevoked"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"LinkCountChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileRenamed"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileDeleted"} (app.js, line 270)
          cb && cb(obj);
        }, true);
        params['path'] = params['path'] || ($bc_$4.pN.path.tempDir());

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$4.pN.window.createFileChangeWatcher(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 从变化监视器中移除
  removeFromChangeWatcher: function (jsonObj) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        params['path'] = params['path'] || ($bc_$4.pN.path.tempDir());

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        return $bc_$4.pN.window.removeFromChangeWatcher(JSON.stringify(params))
      } catch (e) {
        console.error(e);
      }
    }

    return false
  },

  // 打印 (一般情况下，不建议使用)
  print: function (jsonObj) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        params['silent'] = params['silent'] || false;
        params['printBackground'] = params['printBackground'] || false;

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        return $bc_$4.pN.window.print(JSON.stringify(params))
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 打印到PDF  (一般情况下，不建议使用)
  printToPDF: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['marginsType'] = params['marginsType'] || 0;
        params['pageSize'] = params['pageSize'] || 'A4';
        params['printBackground'] = params['printBackground'] || false;
        params['printSelectionOnly'] = params['printSelectionOnly'] || false;
        params['landscape'] = params['landscape'] || false;
        params['filePath'] = params['filePath'] || ($bc_$4.pN.path.tempDir() + '/' + Date
          .now() + '.pdf');

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        return $bc_$4.pN.window.printToPDF(JSON.stringify(params))
      } catch (e) {
        console.error(e);
      }
    }
  }

};

//
// -----------------------------------------------
var app = $bc_$4;

var $bc_$5 = common;

/**
* XPC 内容封装
* @type {{install: Function, unInstall: Function, find: Function, resume: Function, suspend: Function, invalidate: Function, sendMessage: Function}}
*/
$bc_$5.XPC = {
  /**
  * 安装新的XPC关联
  * @param jsonObj
  * @returns {*}
  */
  install: function (jsonObj) {
    if ( jsonObj === void 0 ) jsonObj = {};

    if ($bc_$5.pN) {
      try {
        var params = {
          key: jsonObj.xpc_key || 'default',
          id: jsonObj.bundleID || 'com.romanysoft.app.mac.xpc.AgentHelper'
        };

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        return $bc_$5.pN.app.registerNewXPCService(JSON.stringify(params))
      } catch (e) {
        console.error(e);
      }
    }

    return false
  },

  /**
  * 解除XPC的关联
  * @param xpc_key
  * @returns {*}
  */
  unInstall: function (xpc_key) {
    if ($bc_$5.pN) {
      try {
        return $bc_$5.pN.app.unRegisterXPCService(xpc_key)
      } catch (e) {
        console.error(e);
      }
    }

    return false
  },

  /**
  * 查找XPC是否存在
  * @param xpc_key  xpc关联的Key的唯一标识
  * @returns {true/false}
  */
  find: function (xpc_key) {
    if ($bc_$5.pN) {
      try {
        return $bc_$5.pN.app.hasXPCService(xpc_key || 'default')
      } catch (e) {
        console.error(e);
      }
    }

    return false
  },

  /**
  * 恢复XPC服务
  * @param xpc_key
  */
  resume: function (xpc_key) {
    if ($bc_$5.pN) {
      try {
        $bc_$5.pN.app.resumeXPCService(xpc_key);
      } catch (e) {
        console.error(e);
      }
    }
  },

  /**
  * 挂起XPC服务
  * @param xpc_key
  */
  suspend: function (xpc_key) {
    if ($bc_$5.pN) {
      try {
        $bc_$5.pN.app.suspendXPCService(xpc_key);
      } catch (e) {
        console.error(e);
      }
    }
  },

  /**
  * 使XPC服务失效
  * @param xpc_key
  */
  invalidate: function (xpc_key) {
    if ($bc_$5.pN) {
      try {
        $bc_$5.pN.app.invalidateXPCService(xpc_key);
      } catch (e) {
        console.error(e);
      }
    }
  },

  /**
  * 向XPC发送消息
  * @param jsonObj 基础信息
  * @param cb 回调函数
  * @returns {*}
  */
  sendMessage: function (jsonObj, cb) {
    if ($bc_$5.pN) {
      try {
        var _json = jsonObj || {};
        var params = {
          xpc_key: _json.xpc_key || 'default',
          callback: _json.callback || $bc_$5._get_callback(function (obj) {
            cb && cb(obj);
          }, true),
          messageDic: _json.messageDic
        };

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        return $bc_$5.pN.app.sendMessageToXPCService(JSON.stringify(params))
      } catch (e) {
        console.error(e);
      }
    }
  }
};

/** *
* XPC Node Helper
* @type {{exec: Function}}
*/
$bc_$5.XPCNodeHelper = {
  /**
  * 获得默认的Node XPC Key
  * @returns {string}
  */
  getXPCKey: function () {
    return 'g_romanysoft_node_xpc'
  },

  /**
  * 获得NodeHelper的关键字
  * @returns {string}
  */
  getHelperBundleID: function () {
    return 'com.romanysoft.app.mac.xpc.NodeHelper'
  },

  /**
  * 执行Node命令
  * @param jsonObj
  * @param successCB 成功函数
  * @param failedCB  失败函数
  */
  exec: function (jsonObj, successCB, failedCB) {
    var $t = this;

    var xpc_key = $t.getXPCKey();
    var helperID = $t.getHelperBundleID();

    var canExec = false;

    // 备注，这种方式，暂时没有办法通过Sandbox
    alert('这是个弃用的方式,因为现在没有办法突破Sandbox');

    // 检查是否已经安装过
    if ($bc_$5.XPC.find(xpc_key) === false) {
      canExec = $bc_$5.XPC.install({
        xpc_key: xpc_key,
        bundleID: helperID
      });
    } else {
      canExec = true;
    }

    // 根据是否可以执行来处理
    if (canExec) {
      var pluginDir = $bc_$5.App.getAppPluginDir();
      var node_path = pluginDir + '/node';

      var _json = jsonObj || {};

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          _json[key] = jsonObj[key];
        }
      }

      // 创建任务
      var messageDic = {
        'ms_type': 'CALL_TASK',
        'ms_obj': {
          'taskAppPath': node_path,
          'command': _json.command || ['-v'],
          'currentDirectoryPath': _json.currentDirectoryPath || '',
          'environmentDic': _json.environmentDic || {},
          'mainThread': _json.mainThread || false
        }
      };

      // 发送消息
      $bc_$5.XPC.sendMessage({
        'xpc_key': xpc_key,
        'messageDic': messageDic
      }, function (obj) {
        successCB && successCB(obj);
      });
    } else {
      console.error('XPCNodeHelper install failed.');
      failedCB && failedCB();
    }
  }
};

$bc_$5.XPCPythonHelper = {
  /**
  * 获得默认的Node XPC Key
  * @returns {string}
  */
  getXPCKey: function () {
    return 'g_romanysoft_python_xpc'
  },

  /**
  * 获得NodeHelper的关键字
  * @returns {string}
  */
  getHelperBundleID: function () {
    return 'com.romanysoft.app.mac.xpc.PythonHelper'
  },

  /**
  * 通用执行Python命令
  * @param jsonObj
  * @param successCB
  * @param failedCB
  */
  common_exec: function (jsonObj, successCB, failedCB) {
    var $t = this;

    var xpc_key = $t.getXPCKey();
    var helperID = $t.getHelperBundleID();

    var canExec = false;

    // 备注，这种方式，暂时没有办法通过Sandbox
    alert('这是个弃用的方式,因为现在没有办法突破Sandbox');

    // 检查是否已经安装过
    if ($bc_$5.XPC.find(xpc_key) === false) {
      canExec = $bc_$5.XPC.install({
        xpc_key: xpc_key,
        bundleID: helperID
      });
    } else {
      canExec = true;
    }

    // 根据是否可以执行来处理
    if (canExec) {
      var pluginDir = $bc_$5.App.getAppPluginDir();
      var pythonCLI_path = pluginDir + '/pythonCLI';

      var _json = jsonObj || {};

      // 创建任务
      var messageDic = {
        'ms_type': 'CALL_TASK',
        'ms_obj': {
          'taskAppPath': pythonCLI_path,
          'command': _json.command || ['-v'],
          'currentDirectoryPath': _json.currentDirectoryPath || '',
          'environmentDic': _json.environmentDic || {},
          'mainThread': _json.mainThread !== false
        }
      };

      // 发送消息
      $bc_$5.XPC.sendMessage({
        'xpc_key': xpc_key,
        'messageDic': messageDic
      }, function (obj) {
        successCB && successCB(obj);
      });
    } else {
      console.error('XPCNodeHelper install failed.');
      failedCB && failedCB();
    }
  },

  _formatCommand: function (pythonCommand) {
    if (typeof pythonCommand !== 'string') {
      console.error('command must be string');
      alert('command must be string');
      return null
    }

    // 构造基本的命令
    var workDir = $bc_$5.App.getAppResourceDir() + '/data/python';
    var resourceDir = $bc_$5.App.getAppDataHomeDir();
    var configFile = 'Resources/config.plist';

    // 格式化
    var regCommand =
      '["-i","id.pythonCLI","-c","%config%","-r","%resourceDir%","-w","%workDir%","-m","%command%"]';
    var formatCommonStr = regCommand.replace(/%config%/g, configFile);
    formatCommonStr = formatCommonStr.replace(/%resourceDir%/g, resourceDir);
    formatCommonStr = formatCommonStr.replace(/%workDir%/g, workDir);
    formatCommonStr = formatCommonStr.replace(/%command%/g, pythonCommand);

    // 转换成标准的Command 数组
    var command = window.eval(formatCommonStr); // 转换成command

    return command
  },

  /**
  * 内置的执行方式
  * @param jsonObj
  * @param successCB
  * @param failedCB
  */
  exec: function (jsonObj, successCB, failedCB) {
    var $t = this;
    var _json = jsonObj || {};

    var pythonCommand = _json.command || ''; // {string}
    var command = $t._formatCommand(pythonCommand);

    // 传递参数
    var newJson = {
      command: command || ['-v'],
      currentDirectoryPath: _json.currentDirectoryPath || '',
      'environmentDic': _json.environmentDic || {},
      'mainThread': _json.mainThread !== false
    };

    $t.common_exec(newJson, successCB, failedCB);
  },

  /**
  * 启动Python假设的WebServer
  * @param jsonObj
  * @param successCB
  * @param failedCB
  */
  startWebServer: function (jsonObj, successCB, failedCB) {
    var $t = this;

    var _json = jsonObj || {};

    // 传递参数
    var newJson = {
      'command': ' --port=' + $bc_$5.App.getServerPort(), // {要求string}
      'currentDirectoryPath': _json.currentDirectoryPath || '',
      'environmentDic': _json.environmentDic || {},
      'mainThread': _json.mainThread !== false
    };

    $t.exec(newJson, successCB, failedCB);
  }

};

// -----------------------------------------------
var xpc = $bc_$5;

var $bc_$6 = common;
/**
 * 窗体的设置
 * @type {{minimize: Function, maximize: Function, toggleFullScreen: Function, restore: Function, isMaximized: Function, move: Function, resize: Function, setMinSize: Function, setMaxSize: Function}}
 */
$bc_$6.Window = {

  // 最小化窗体
  minimize: function () {
    if ($bc_$6.pN) { $bc_$6.pN.window.minimize(); }
  },

  // 最大化窗体
  maximize: function () {
    if ($bc_$6.pN) { $bc_$6.pN.window.maximize(); }
  },

  // 全屏切换
  toggleFullScreen: function () {
    if ($bc_$6.pN) { $bc_$6.pN.window.toggleFullscreen(); }
  },

  // 窗体状态恢复
  restore: function () {
    if ($bc_$6.pN) { $bc_$6.pN.window.restore(); }
  },

  // 是否最大化
  isMaximized: function () {
    if ($bc_$6.pN) {
      return $bc_$6.pN.window.isMaximized()
    }

    return false
  },

  // 获取原点坐标
  getOrigin: function () {
    if ($bc_$6.pN) {
      return JSON.parse($bc_$6.pN.window.getOrigin())
    }
    return {
      x: 0,
      y: 0
    }
  },

  // 移动窗体
  move: function (jsonObj) {
    if ($bc_$6.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['x'] = jsonObj['x'] || 0.0;
        params['y'] = jsonObj['y'] || 0.0;

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$6.pN.window.move(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动窗体移动!');
    }
  },

  // 改变窗体大小
  resize: function (jsonObj) {
    if ($bc_$6.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600;
        params['height'] = jsonObj['height'] || 400;

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$6.pN.window.resize(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动窗体重置大小!');
    }
  },

  // 获取窗体尺寸最小值
  getMinSize: function () {
    if ($bc_$6.pN) {
      return JSON.parse($bc_$6.pN.window.getMinSize())
    }
    return {
      width: 600,
      height: 400
    }
  },

  // 设置窗体尺寸最小值
  setMinSize: function (jsonObj) {
    if ($bc_$6.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600;
        params['height'] = jsonObj['height'] || 400;

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$6.pN.window.setMinsize(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动窗体设置最小尺寸!');
    }
  },

  // 获取窗体最大值
  getMaxSize: function () {
    if ($bc_$6.pN) {
      return JSON.parse($bc_$6.pN.window.getMaxSize())
    }
    return {
      width: 600,
      height: 400
    }
  },

  // 设置窗体最大值
  setMaxSize: function (jsonObj) {
    if ($bc_$6.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600;
        params['height'] = jsonObj['height'] || 400;

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$6.pN.window.setMaxsize(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动窗体设置最大尺寸!');
    }
  },

  // 获取窗体当前尺寸
  getSize: function () {
    if ($bc_$6.pN) {
      return JSON.parse($bc_$6.pN.window.getSize())
    }

    return {
      width: 600,
      height: 400
    }
  },

  // 设置窗体当前尺寸
  setSize: function (jsonObj) {
    if ($bc_$6.pN) {
      try {
        var params = jsonObj || {};
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600;
        params['height'] = jsonObj['height'] || 400;

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key];
          }
        }

        $bc_$6.Window.resize(params);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动窗体设置最大尺寸!');
    }
  }

};

// -----------------------------------------------
var window$1 = $bc_$6;

var $bc_$7 = common;

/**
 * 系统菜单控制
 * @type {{setMenuProperty: Function, maxRecentDocumentCount: Function, addRecentDocument: Function, clearAllRecentDocuments: Function}}
 */
$bc_$7.SystemMenus = {
  setMenuProperty: function (paramOptions, cb, actionCB) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$7._get_callback(function (obj) {
        console.log('call callback.cb ...');
        cb && cb(obj);
      }, true);
      params['menuTag'] = paramOptions['menuTag'] || 999;
      params['hideMenu'] = paramOptions['hideMenu'] || false;
      params['isSeparatorItem'] = paramOptions['isSeparatorItem'] || false; // 是否为分割线，用来创建新的Item
      params['title'] = paramOptions['title'] || '##**'; // "MenuTitle";
      params['action'] = paramOptions['action'] || $bc_$7._get_callback(function (obj) {
        console.log('call actionCB ...');
        actionCB && actionCB(obj);
      }, true);

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$7.pN) {
        $bc_$7.pN.window.setMenuProperty(JSON.stringify(params));
      } else {
        alert('启动系统菜单控制!');
      }
    } catch (e) {
      console.error(e);
    }
  },
  maxRecentDocumentCount: function () {
    if ($bc_$7.pN) {
      return $bc_$7.pN.window.maxRecentDocumentCount()
    }

    return 0
  },
  addRecentDocument: function (paramOptions) {
    if ($bc_$7.pN) {
      try {
        var params = paramOptions || {};
        // 限制内部属性：
        params['url'] = paramOptions['url'] || '';
        params['mustWritable'] = paramOptions['mustWritable'] || false;

        // / 统一向后兼容处理
        for (var key in paramOptions) {
          if (paramOptions.hasOwnProperty(key)) {
            params[key] = paramOptions[key];
          }
        }

        $bc_$7.pN.window.addRecentDocument(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('启动添加最近使用文档功能');
    }
  },
  clearAllRecentDocuments: function () {
    if ($bc_$7.pN) { $bc_$7.pN.window.clearAllRecentDocuments(); }
  }

};

// -----------------------------------------------
var menu = $bc_$7;

var $bc_$8 = common;

/**
 * 剪贴板操作
 * @type {{copy: Function, paste: Function}}
 */
$bc_$8.Clipboard = {
  copy: function (stringText) {
    if ($bc_$8.pN) {
      $bc_$8.pN.clipboard.copy(stringText);
    }
  },
  paste: function () {
    if ($bc_$8.pN) {
      return $bc_$8.pN.clipboard.paste()
    }
  }
};

//
// -----------------------------------------------
var clipboard = $bc_$8;

var $bc_$9 = common;

/**
 * Dock 浮动图标上的设置内容
 * @type {{setBadge: Function, getBadge: Function}}
 */
$bc_$9.Dock = {
  setBadge: function (text) {
    if ($bc_$9.pN) {
      $bc_$9.pN.dock.setBadge(text);
    }
  },
  getBadge: function () {
    if ($bc_$9.pN) {
      return $bc_$9.pN.dock.badge
    }

    return 'dock'
  }
};

//
// -----------------------------------------------
var dock = $bc_$9;

var $bc_$10 = common;

/**
 * 二进制扩展
 * @type {{createBinaryFile: Function, createTextFile: Function, getUTF8TextContentFromFile: Function, base64ToFile: Function, base64ToImageFile: Function, imageFileConvertToOthers: Function}}
 */
$bc_$10.Binary = {
  createBinaryFile: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || '';
      params['data'] = paramOptions['data'] || '';
      params['offset'] = paramOptions['offset'] || 0;
      params['dataAppend'] = paramOptions['dataAppend'] || false;

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        $bc_$10.pN.binaryFileWriter.writeBinaryArray(JSON.stringify(params));
      } else {
        alert('创建二进制文件');
      }
    } catch (e) {
      console.error(e);
    }
  },

  createTextFile: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || '';
      params['text'] = paramOptions['text'] || '';
      params['offset'] = paramOptions['offset'] || 0;
      params['dataAppend'] = paramOptions['dataAppend'] || false;

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        $bc_$10.pN.binaryFileWriter.writeTextToFile(JSON.stringify(params));
      } else {
        alert('创建文本文件');
      }
    } catch (e) {
      console.error(e);
    }
  },

  getUTF8TextContentFromFile: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        /**
         obj.success = true || false
         obj.content =  //内容
         obj.error =    //出错信息
         **/
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || '';
      params['encode'] = paramOptions['encode'] || 'utf8';
      params['async'] = paramOptions['async'] !== false; // 异步的时候，回调函数有效，否则无效，直接返回内容值

      /**
       encode: 说明，不区分大小写
       ASCII,NEXTSTEP,JapaneseEUC,UTF8,ISOLatin1,Symbol,NonLossyASCII,ShiftJIS,ISOLatin2,Unicode
       WindowsCP1251,WindowsCP1252,WindowsCP1253,WindowsCP1254,WindowsCP1250,ISO2022JP,MacOSRoman
       UTF16,UTF16BigEndian,UTF16LittleEndian
       **/

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        return $bc_$10.pN.binaryFileWriter.getTextFromFile(JSON.stringify(params)) // 使用非异步模式(async == false)，直接返回content内容
      } else {
        alert('获取文本文件中的内容（UTF8编码）');
        cb && cb({
          success: true,
          text: ''
        });
      }
    } catch (e) {
      console.error(e);
    }
  },

  base64ToFile: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || '';
      params['base64String'] = paramOptions['base64String'] || '';
      params['dataAppend'] = paramOptions['dataAppend'] || false;

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        $bc_$10.pN.binaryFileWriter.base64ToFile(JSON.stringify(params));
      } else {
        alert('base64编码保存到文件中');
      }
    } catch (e) {
      console.error(e);
    }
  },

  base64ToImageFile: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || '';
      params['base64String'] = paramOptions['base64String'] || '';
      params['imageType'] = paramOptions['imageType'] || 'jpeg'; // png,bmp

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        $bc_$10.pN.binaryFileWriter.base64ToImageFile(JSON.stringify(params));
      } else {
        alert('base64编码保存到图片文件中');
      }
    } catch (e) {
      console.error(e);
    }
  },

  imageFileConvertToOthers: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['filePath'] = paramOptions['filePath'] || ''; // 目标文件
      params['orgFilePath'] = paramOptions['orgFilePath'] || ''; // 源文件
      params['imageType'] = paramOptions['imageType'] || 'jpeg'; // png,bmp

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        $bc_$10.pN.binaryFileWriter.imageFileConvertToOthers(JSON.stringify(params));
      } else {
        alert('图片格式转换');
      }
    } catch (e) {
      console.error(e);
    }
  },

  Sound: {
    playResourceSoundFile: function (fileUrl) {
      if ($bc_$10.pN) { $bc_$10.pN.sound.play(fileUrl); }
    }
  },

  Video: {}

};

//
// -----------------------------------------------
var binary = $bc_$10;

var _$5 = underscore._;

var $bc_$11 = common;
// 启动核心插件功能
$bc_$11.enablePluginCore = function (pluginList, cbFuncName) {
  if ($bc_$11.pN) {
    try {
      var org_pluginArray = pluginList || []; // 插件信息数组
      var pluginArray = [];

      // 过滤调用方式非'call' 的插件
      for (var i = 0; i < org_pluginArray.length; ++i) {
        var plugin = org_pluginArray[i];
        if (plugin['callMethod'] === 'call') {
          pluginArray.push(plugin);
        }
      }

      var extendObj = _$5.clone($bc_$11.pCorePlugin);
      extendObj['callMethod'] = 'initCore';
      if (_$5.isString(cbFuncName)) {
        extendObj['passBack'] = cbFuncName; // 取代默认回调函数
      }
      extendObj['arguments'] = [
        true,
        pluginArray
      ];

      $bc_$11.pN.window.execTask(JSON.stringify(extendObj));
    } catch (e) {
      console.error(e);
    }
  }
};

// -----------------------------------------------
var plugin = $bc_$11;

var _$6 = underscore._;

var $bc_$12 = common;

// 启用拖拽功能
$bc_$12.cb_dragdrop = null; // 启动
/**
 *
 * @param params 参数处理
 */
$bc_$12.enableDragDropFeature = function (jsonObj, cb) {
  var t$ = this;
  if (t$.pN) {
    try {
      var params = jsonObj || {};
      params['callback'] = jsonObj['callback'] || t$._get_callback(function (obj) {
        if (_$6.isFunction(t$.cb_dragdrop)) {
          t$.cb_dragdrop && t$.cb_dragdrop(obj);
        } else {
          cb && cb(obj);
        }
      }, true);
      params['enableDir'] = !!jsonObj['enableDir'] || false;
      params['enableFile'] = jsonObj['enableFile'] !== false;
      params['enableCalculateFolderSize'] = !!jsonObj['enableCalculateFolderSize'] || false;
      params['fileTypes'] = jsonObj['fileTypes'] || ['*']; // ["*","mp3","md", "xls"] 类似这样的格式

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key];
        }
      }

      if (t$.pIsUseElectron) {
        var $ = common.getJQuery$();
        $(document).ready(function () {
          // document.ondragover = document.ondrop = function(e) {
          //   e.preventDefault();
          //   return false;
          // };

          var holder = document; // document.getElementsByTagName('body');
          holder.ondragstart = function (e) {
            console.log('----- holder.ondragstart -----');
            e.preventDefault();
          };

          holder.ondragover = function () {
            console.log('----- holder.ondragover -----');
            return false
          };
          holder.ondragleave = holder.ondragend = function () {
            console.log('----- holder.ondragleave or holder.ondragend -----');
            // this.className = '';
            return false
          };
          holder.ondrop = function (e) {
            console.log('----- holder.ondrop -----');
            // this.className = '';
            e.preventDefault();

            // 传递dataTransfer.files 给本地引擎，让本地引擎去详细处理
            var pathList = [];
            _$6.each(e.dataTransfer.files, function (fileObj, index, list) {
              pathList.push(fileObj.path);
            });

            try {
              t$.pN.window.proxyProcessDragDropWithPaths(pathList);
            } catch (e) {
              console.error(e);
            }
          };
        });
      }

      t$.pN.window.setDragDropConfig(JSON.stringify(params));
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log('[Notice] Not Native enableDragDropFeature');
  }
};

//
// -----------------------------------------------
var dragdrop = $bc_$12;

var _$7 = underscore._;
var $bc_$13 = common;

var TypeTriggerMsg = {
  UNKnown: 'NativeTask_UNKnown',
  onCreate: 'NativeTask_onCreate',
  // process_init
  //
  onNativeEngineInitSuccess: '_native_engine_init_success',
  onNativeEngineInitFailed: '_native_engine_init_failed',
  // process_dylibCLI
  //
  onDylibCLIStart: '_native_clicall_start',
  onDylibCLIFeedback: '_native_clicall_feedback',
  onDylibCLIEnd: '_native_clicall_end',
  // process_execCommand
  //
  onExecCommandAdded: '_native_execCommand_added',
  onExecCommandStarted: '_native_execCommand_start',
  onExecCommandFeedback: '_native_execCommand_feedback',
  onExecCommandSuccess: '_native_execCommand_success',
  onExecCommandCanceled: '_native_execCommand_canceled',
  onExecCommandError: '_native_execCommand_error',
  // process_task
  //
  onTaskAdded: '_native_task_added',
  onTaskStarted: '_native_task_started',
  onTaskFinished: '_native_task_finished',
  onTaskError: '_native_task_error',
  onTaskCanceled: '_native_task_canceled'
};

// 来自于底层的消息类型统一
var TypeNativeMessageType = {
  // process_init
  InitCoreSuccess: 'type_initcoresuccess',
  InitCoreFailed: 'type_initcorefailed',

  // process_dylibCLI
  CliCallStart: 'type_clicall_start',
  CliCallReportProgress: 'type_clicall_reportprogress',
  CliCallEnd: 'type_clicall_end',

  // process_execCommand
  AddExecCommandQueueSuccess: 'type_addexeccommandqueue_success',
  ExecCommandStart: 'type_execcommandstart',
  ExecCommandReportProgress: 'type_reportexeccommandprogress',
  ExecCommandSuccess: 'type_execcommandsuccess',
  CancelExecCommand: 'type_canceledexeccommand',
  ExecCommandFailed: 'type_execcommanderror',

  // process_task
  AddCallTaskQueueSuccess: 'type_addcalltaskqueue_success',
  CallTaskStart: 'type_calltask_start',
  CallTaskFailed: 'type_calltask_error',
  CallTaskLog: 'type_calltask_log',
  CallTaskSuccess: 'type_calltask_success',
  CancelCallTask: 'type_type_calltask_cancel'

};

/**
 * 调用Task的方法
 */
var TaskMethodWay = {
  InitCore: 'initCore',
  Task: 'task',
  SendEvent: 'sendEvent'
};

/**
 * 格式化，使用插件模式，传递的command数组。
 * 例如："copyPlugin.tool.command" 需要格式化
 var copyPlugin = $.objClone(t$.plguinData);
 copyPlugin.tool.command = ["-g",
 {
   "$api":"GetXLSFileInfo",
   "filePath":_path
 }];

  $bc_.createTask(copyPlugin.callMethod, Date.now(), [copyPlugin.tool], $bc_._get_callback(function(obj)
  * @param commandList
  */
$bc_$13.formatCommand = function (commandList) {
  // 命令自动加入''
  var formatArgs = [];

  _$7.each(commandList || [], function (ele, index, list) {
    var formatEle = '';
    if (_$7.isBoolean(ele)) { formatEle = "'" + ele + "'"; }
    if (_$7.isNumber(ele)) { formatEle = ele; }
    if (_$7.isString(ele)) { formatEle = "'" + ele + "'"; }
    if (_$7.isFunction(ele)) { formatEle = null; }
    if (_$7.isArray(ele)) { formatEle = "'" + JSON.stringify(ele) + "'"; }
    if (_$7.isDate(ele)) { formatEle = "'" + JSON.stringify(ele) + "'"; }
    if (_$7.isRegExp(ele)) { formatEle = "'" + ele.toString() + "'"; }
    if (_$7.isObject(ele)) { formatEle = "'" + JSON.stringify(ele) + "'"; }
    if (formatEle !== null) {
      formatArgs.push(formatEle);
    }
  });

  return formatArgs
};
// 创建任务
/**
 *
 * @param callMethod  调用方式：task，sendEvent，
 * @param taskId
 * @param args
 * @param cbFuncName callback 回调函数的名称
 */
$bc_$13.createTask = function (callMethod, taskId, args, cbFuncName) {
  try {
    var extendObj = _$7.clone($bc_$13.pCorePlugin);
    extendObj['passBack'] = cbFuncName || extendObj['passBack'];
    extendObj['callMethod'] = callMethod;
    extendObj['arguments'] = [taskId, args];

    var argumentJSONString = JSON.stringify(extendObj);
    if ($bc_$13.pN) {
      $bc_$13.pN.window.execTask(argumentJSONString);
    } else {
      cbFuncName && window.eval(cbFuncName + '()');
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 新增一个简单的任务调用方式，用来解决简单的任务的启动处理
 * @param method 任务接口调用方式，参照$bc_.createTask. //task, sendEvent, initCore 等等
 * @param callbackName 处理该任务的全局处理函数
 * @param args 需要填写的参数
 */
$bc_$13.runTaskSample = function (method, callbackName, args) {
  if ( method === void 0 ) method = TaskMethodWay.Task;
  if ( args === void 0 ) args = [
  _$7.now(),   // TaskID
  [{         // TaskCommand
    appPath: '',
    command: [],
    mainThread: false
  }]
];

  try {
    if ($bc_$13.pN) {
      $bc_$13.pN.window.execTask(JSON.stringify({
        useThread: true,
        passBack: callbackName,
        packageMode: 'bundle',
        taskToolPath: '/Plugins/extendLoader.bundle',
        bundleClassName: 'LibCommonInterface',
        callMethod: method,
        arguments: args
      }));
    } else {
      callbackName && window.eval(callbackName + '()');
    }
  } catch (error) {
    console.error(error);
  }
};

// 自动判断几种任务类型，自动启动任务(2016.1.20)添加，方便函数
$bc_$13.autoStartTask = function (obj, cbFuncName) {
  try {
    if ($bc_$13.pN) {
      var infoType = obj.type;
      var queueID = null;
      if (infoType === 'type_addexeccommandqueue_success') {
        queueID = obj.queueInfo.id;
        $bc_$13.sendQueueEvent(queueID, 'execcommand', 'start', cbFuncName);
      }
      if (infoType === 'type_addcalltaskqueue_success') {
        queueID = obj.queueInfo.id;
        $bc_$13.sendQueueEvent(queueID, 'calltask', 'start', cbFuncName);
      }
    } else {
      cbFuncName && window.eval(cbFuncName + '()');
    }
  } catch (e) {}
};

// 发送任务事件
/**
* @function {function name}
* @param  {String/Number} queueID    内部队列ID
* @param  {String} queueType  队列类型：1.import; 2.export; 3.execcommand; 4.calltask
* @param  {String} event      队列事件类型：1.start; 2.pause; 3.stop
* @param  {String} cbFuncName 回调函数名称，全局类型
* @return {type} {description}
*/
$bc_$13.sendQueueEvent = function (queueID, queueType, event, cbFuncName) {
  try {
    var extendObj = _$7.clone($bc_$13.pCorePlugin);
    extendObj['passBack'] = cbFuncName || extendObj['passBack'];
    extendObj['callMethod'] = 'sendEvent';
    extendObj['arguments'] = [event, queueType, queueID];

    if ($bc_$13.pN) {
      $bc_$13.pN.window.execTask(JSON.stringify(extendObj));
    } else {
      cbFuncName && window.eval(cbFuncName + '()');
    }
  } catch (e) {
    console.error(e);
  }
};

$bc_$13.Task = {
  TypeDefined: {
    TypeTriggerMsg: TypeTriggerMsg,
    TypeNativeMessageType: TypeNativeMessageType,
    TaskMethodWay: TaskMethodWay
  },
  Methods: {
    formatCommand: $bc_$13.formatCommand,
    createTask: $bc_$13.createTask,
    runTaskSample: $bc_$13.runTaskSample,
    autoStartTask: $bc_$13.autoStartTask,
    sendQueueEvent: $bc_$13.sendQueueEvent
  }
};

// -----------------------------------------------
var task = $bc_$13;

var _$8 = underscore._;

var $bc_$14 = common;

// 导入文件
/**
 BS.$bc_.cb_importFiles({
 "success":true,
 "parentDir":"/Volumes/DiskShareUser/Users/ian/TestResource/xls",
 "filesCount":1,
 "filesArray":[
    {"isExecutable":true,
    "isDeletable":false,
    "fileNameWithoutExtension":"Book1",
    "fileName":"Book1.xls",
    "fileSize":7680,
    "fileSizeStr":"7.7KB",
    "fileUrl":"file:///Volumes/DiskShareUser/Users/ian/TestResource/xls/Book1.xls",
    "isReadable":true,
    "isWritable":true,
    "extension":"xls",
    "filePath":"/Volumes/DiskShareUser/Users/ian/TestResource/xls/Book1.xls"
    }
  ]
});
  **/
$bc_$14.cb_importFiles = null; // 导入文件的回调
/**
 * 导入文件
 * @param params 参数的json对象
 * @param noNcb 非Native的状态下，执行的回调函数
 * @param cb    Native状态下，执行的回调函数是，默认是优化外部传入函数
 */
$bc_$14.importFiles = function (paramOptions, noNcb, cb) {
  var _this = this;
  try {
    var params = {};
    // 限制内部属性：
    params['callback'] = paramOptions['callback'] || _this._get_callback(function (obj) {
      if (_this.cb_importFiles) {
        _this.cb_importFiles && _this.cb_importFiles(obj);
      } else {
        cb && cb(obj);
      }
    }, true);
    params['title'] = paramOptions['title'] || 'Select a file';
    params['prompt'] = paramOptions['prompt'] || 'Open';

    params['allowOtherFileTypes'] = paramOptions['allowOtherFileTypes'] || false;
    params['allowMulSelection'] = paramOptions['allowMulSelection'] || false;
    params['canCreateDir'] = paramOptions['canCreateDir'] || false;
    params['canChooseFiles'] = true;
    params['canChooseDir'] = false;
    params['canAddToRecent'] = true; // 是否添加到最近目录中
    params['calculateDirSize'] = !!paramOptions['calculateDirSize'] || false;
    params['directory'] = paramOptions['directory'] || ''; // 默认指定的目录
    params['types'] = paramOptions['types'] || []; // eg. ['png','svg'] 或 ['*']

    // 下拉文件类型选择处理
    params['enableFileFormatCombox'] = paramOptions['enableFileFormatCombox'] || false;
    params['typesDescript'] = paramOptions['typesDescript'] || [];
    params['lable'] = paramOptions['lable'] || 'File Format:';
    params['label'] = paramOptions['label'] || 'File Format:';
    // [end]下拉文件类型选择处理

    // / 统一向后兼容处理
    for (var key in paramOptions) {
      if (paramOptions.hasOwnProperty(key)) {
        params[key] = paramOptions[key];
      }
    }

    if ($bc_$14.pN) {
      $bc_$14.pN.window.openFile(JSON.stringify(params));
    } else {
      alert('启动选择文件对话框!');
      noNcb && noNcb();
    }
  } catch (e) {
    console.error(e);
  }
};

// 选择输出目录
/**
 * 选择目录传入的参数：
 * {
        callback: "BS.$bc_.cb_selectOutDir",
        allowOtherFileTypes: false,
        canCreateDir: true,
        canChooseDir: true,
        canChooseFiles: false, // 不可以选择文件
        title: "Select Directory",
        prompt: "Select",
        types: []              // 类型要为空
    }
  * @type {null}
  */
$bc_$14.cb_selectOutDir = null; // 选择输出目录的回调
/**
 * 选择输出目录
 * @param params 传递的json对象
 * @param noNcb 非Native状态下，执行
 * @param cb 在Native下，可以通过传递cb来执行
 */
$bc_$14.selectDir = $bc_$14.selectOutDir = function (paramOptions, noNcb, cb) {
  try {
    var params = {};

    // 限制内部属性：
    params['callback'] = paramOptions['callback'] || $bc_$14._get_callback(function (obj) {
      if (_$8.isFunction($bc_$14.cb_selectOutDir)) {
        $bc_$14.cb_selectOutDir && $bc_$14.cb_selectOutDir(obj);
      } else {
        cb && cb(obj);
      }
    }, true);
    params['title'] = paramOptions['title'] || 'Select Directory';
    params['prompt'] = paramOptions['prompt'] || 'Select';

    params['allowOtherFileTypes'] = paramOptions['allowOtherFileTypes'] || false;
    params['allowMulSelection'] = paramOptions['allowMulSelection'] || false;
    params['canCreateDir'] = paramOptions['canCreateDir'] !== false;
    params['canChooseDir'] = true;
    params['canChooseFiles'] = false; // 不可以选择文件
    params['canAddToRecent'] = true; // 是否添加到最近目录中
    params['calculateDirSize'] = !!paramOptions['calculateDirSize'] || false;
    params['directory'] = paramOptions['directory'] || ''; // 默认指定的目录
    params['types'] = [];

    // / 统一向后兼容处理
    for (var key in paramOptions) {
      if (paramOptions.hasOwnProperty(key)) {
        params[key] = paramOptions[key];
      }
    }

    if ($bc_$14.pN) {
      $bc_$14.pN.window.openFile(JSON.stringify(params));
    } else {
      alert('启动选择目录对话框!');
      noNcb && noNcb();
    }
  } catch (e) {
    console.error(e);
  }
};

// 选择输出文件
/*
  BS.$bc_.cb_selectOutFile({
  "success":true,
  "fileName":"untitled.csv",
  "fileUrl":"file:///Volumes/DiskShareUser/Users/ian/TestResource/xls/untitled.csv",
  "fileNameWithoutExtension":"untitled",
  "extension":"csv",
  "filePath":"/Volumes/DiskShareUser/Users/ian/TestResource/xls/untitled.csv"
  });
  */
$bc_$14.cb_selectOutFile = null; // 选择输出文件的回调
/**
 * 选择输出文件
 * @param params 传递的json对象
 * @param noNcb 非Native状态下，执行
 * @param cb 在Native下，可以通过传递cb来执行
 */
$bc_$14.selectOutFile = function (paramOptions, noNcb, cb) {
  if ($bc_$14.pN) {
    try {
      var params = {};

      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$14._get_callback(function (obj) {
        if (_$8.isFunction($bc_$14.cb_selectOutFile)) {
          $bc_$14.cb_selectOutFile && $bc_$14.cb_selectOutFile(obj);
        } else {
          cb && cb(obj);
        }
      }, true);
      params['title'] = paramOptions['title'] || 'Save as';
      params['prompt'] = paramOptions['prompt'] || 'Save';

      params['allowOtherFileTypes'] = false;
      params['canCreateDir'] = paramOptions['canCreateDir'] !== false;
      params['canAddToRecent'] = true; // 是否添加到最近目录中
      params['fileName'] = paramOptions['fileName'] || 'untitled';
      params['directory'] = paramOptions['directory'] || ''; // 默认指定的目录
      params['types'] = paramOptions['types'] || ['*']; // 要求的数组

      params['calculateDirSize'] = !!paramOptions['calculateDirSize'] || false;

      // 下拉文件类型选择处理
      params['enableFileFormatCombox'] = paramOptions['enableFileFormatCombox'] || false;
      params['typesDescript'] = paramOptions['typesDescript'] || [];
      params['lable'] = paramOptions['lable'] || 'File Format:';
      params['label'] = paramOptions['label'] || 'File Format:';
      // [end]下拉文件类型选择处理

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      $bc_$14.pN.window.saveFile(JSON.stringify(params));
    } catch (e) {
      console.error(e);
    }
  } else {
    alert('启动选择输出文件对话框!');
    noNcb && noNcb();
  }
};

// -----------------------------------------------
var filedialog = $bc_$14;

var _$11 = underscore._;

var __$p$$2 = {
  init: function () {
    this.__mc = new Observable();
  },
  debugLog: false,
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debugLog) {
      console.log(title, message, end);
    }
  },

  getEvents: function () {
    return this.__mc.getMetaDataEvents()
  },
  bind: function (eventName, handlers, one) {
    if ( one === void 0 ) one = false;

    this.__mc.bind(eventName, handlers, one);
  },
  one: function (eventNames, handlers) {
    this.__mc.one(eventNames, handlers);
  },
  first: function (eventName, handlers) {
    this.__mc.first(eventName, handlers);
  },
  trigger: function (eventName, e) {
    // 检测e的对象类型
    if (_$11.isString(e)) {
      try {
        e = JSON.parse(e);
      } catch (err) {
        this.log('found err:', err);
        e = {
          data: e
        };
      }
    }
    this.__mc.trigger(eventName, e);
  },
  unbind: function (eventName, handler) {
    this.__mc.unbind(eventName, handler);
  }
};

var ProxyMessageCenter = SelfClass.extend(__$p$$2);

var _$12 = underscore._;

/**
 * 纯算法，不依赖bs模块及util模块
 */
var Tool = {
  /**
   * Get the first item that pass the test
   * by second argument function
   *
   * @param {Array} list
   * @param {Function} f
   * @return {*}
   */
  find: function (list, f) {
    return list.filter(f)[0]
  },
  /**
   * Deep copy the given object considering circular structure.
   * This function caches all nested objects and its copies.
   * If it detects circular structure, use cached copy to avoid infinite loop.
   *
   * @param {*} obj
   * @param {Array<Object>} cache
   * @return {*}
   */
  deepCopy: function (obj, cache) {
    if ( cache === void 0 ) cache = [];

    var t$ = this;
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    // if obj is hit, it is in circular structure
    var hit = t$.find(cache, function (c) { return c.original === obj; });
    if (hit) {
      return hit.copy
    }

    var copy = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
      original: obj,
      copy: copy
    });

    Object.keys(obj).forEach(function (key) {
      copy[key] = t$.deepCopy(obj[key], cache);
    });

    return copy
  },
  forEachValue: function (obj, fn) {
    Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
  },
  assert: function (condition, msg) {
    if (!condition) { throw new Error(("[sdk] " + msg)) }
  },
  getType: function (o) {
    return Object.prototype.toString.call(o)
  },
  isUndefinedOrNull: function (o) {
    return _$12.isUndefined(o) || _$12.isNull(o)
  },
  isUndefinedOrNullOrFalse: function (o) {
    return this.isUndefinedOrNull(o) || o === false
  },
  isObject: _$12.isObject,
  isError: _$12.isError,
  isNaN: _$12.isNaN,
  isFinite: _$12.isFinite,
  isArguments: _$12.isArguments,
  isElement: _$12.isElement,
  isEmpty: _$12.isEmpty,
  isMatch: _$12.isMatch,
  isEqual: _$12.isEqual,
  isPromise: function (val) {
    return val && typeof val.then === 'function'
  },
  isArray: _$12.isArray,
  isBoolean: _$12.isBoolean,
  isString: _$12.isString,
  isNull: _$12.isNull,
  isUndefined: _$12.isUndefined,
  isNumber: _$12.isNumber,
  isDate: _$12.isDate,
  isRegExp: _$12.isRegExp,
  isFunction: _$12.isFunction,
  isBlob: function (o) {
    return Object.prototype.toString.call(o) === '[object Blob]'
  },
  /**
   * Blob data convert to String
   * @param o Blob obj
   * @param cb callback function
   */
  blobData2String: function (o, cb) {
    try {
      var reader = new FileReader();
      reader.onload = function (event) {
        cb && cb(reader.result);
      };
      reader.readAsText(o);
    } catch (error) {
      throw error
    }
  },
  /**
   * Blob data convert to ArrayBuffer
   * @param o Blob obj
   * @param cb callback function
   */
  blobData2ArrayBuffer: function (o, cb) {
    try {
      var reader = new FileReader();
      reader.onload = function (event) {
        cb && cb(reader.result);
      };
      reader.readAsArrayBuffer(o);
    } catch (error) {
      throw error
    }
  },
  /**
   * param wrapper to Array
   */
  param2Array: function (param, allowTypes) {
    if ( allowTypes === void 0 ) allowTypes = [];

    var t$ = this;
    if (this.isUndefinedOrNull(param)) { return [] }
    if (allowTypes.findIndex(function (value, index, err) {
      return value === t$.getType(param)
    }) > -1) {
      return [param]
    }
    if (t$.isArray(param)) { return param }
    return []
  },
  /**
   * convert arguments to a Array
   */
  arguments2Array: function () {
    return [].slice.call(arguments, 0)
  },
  /**
   * Format error string
   * @param err  error object
   * @return String
   */
  getErrorMessage: function (err) {
    var msg = '';
    try {
      if (this.isString(err)) {
        msg = err;
      } else if (this.isError(err)) {
        msg = err.message;
      } else if (this.isObject(err)) {
        var errMsg = [];
        for (var p in err) {
          if (err.hasOwnProperty(p)) {
            errMsg.push(p + '=' + err[p]);
          }
        }
        if (errMsg.length === 0) {
          msg = err;
        } else {
          msg = errMsg.join('\n');
        }
      } else {
        msg += '[RTY_CANT_TYPE] = ' + this.getType(err);
        msg += JSON.stringify(err);
      }
    } catch (error) {
      throw error
    }

    return msg
  },
  queue: function (_done) {
    var _next = [];
    var callback = function (err) {
      if (!err) {
        var next = _next.shift();
        if (next) {
          var args = arguments;
          args.length ? (args[0] = callback) : (args = [callback]);
          return next.apply(null, args)
        }
        return _done.apply(null, arguments)
      }
    };

    var r = {
      next: function (fn) {
        _next.push(fn);
        return r
      },
      done: function (fn) {
        _done = fn;
        r.start();
      },
      start: function () {
        callback(null, callback);
      }
    };

    return r
  },
  /**
   * Check fileName's type in the fileTypes
   * @param fileName String
   * @param fileTypes Array []
   * @return Boolean {true, false}
   */
  checkFileType: function (fileName, fileTypes) {
    var _fileNameStr = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
    if (fileTypes.indexOf(_fileNameStr) > -1) { return true }
    return false
  },
  obj2string: function (o) {
    var r = [];
    var t$ = this;
    if (typeof o === 'string') {
      return '\'' + o.replace(/([\'\'\\])/g, '\\$1').replace(/(\n)/g, '\\n')
        .replace(/(\r)/g, '\\r').replace(/(\t)/g, '\\t') + '\''
    }
    if (typeof o === 'object' && o != null) {
      if (!o.sort) {
        for (var i in o) {
          r.push(i + ':' + t$.obj2string(o[i]));
        }
        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
          r.push('toString:' + o.toString.toString());
        }
        r = '{' + r.join() + '}';
      } else {
        for (var i$1 = 0; i$1 < o.length; i$1++) {
          r.push(t$.obj2string(o[i$1]));
        }
        r = '[' + r.join() + ']';
      }
      return r
    }

    if (o != null) {
      return o.toString()
    }

    return ''
  },
  // 字符串参数格式化 {index}
  stringFormat: function () {
    var arguments$1 = arguments;

    if (arguments.length === 0) { return null }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      str = str.replace(re, arguments$1[i]);
    }
    return str
  },
  objClone: function (Obj) {
    var this$1 = this;

    var buf;
    if (Obj instanceof Array) {
      buf = [];
      var i = Obj.length;
      while (i--) {
        buf[i] = this$1.objClone(Obj[i]);
      }
      return buf
    } else if (Obj instanceof Object) {
      buf = {};
      for (var k in Obj) {
        if (Obj.hasOwnProperty(k)) {
          buf[k] = this$1.objClone(Obj[k]);
        }
      }
      return buf
    } else {
      return Obj
    }
  },
  // 获取简易的格式化时间
  getFormatDateStr: function (dateObj, fmt) {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
    // (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
    var that = dateObj;
    var o = {
      'M+': that.getMonth() + 1, // 月份
      'd+': that.getDate(), // 日
      'h+': that.getHours(), // 小时
      'm+': that.getMinutes(), // 分
      's+': that.getSeconds(), // 秒
      'q+': Math.floor((that.getMonth() + 3) / 3), // 季度
      'S': that.getMilliseconds() // 毫秒
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(
          ('' + o[k]).length)));
      }
    }

    return fmt
  },

  /**
   * 比较两个版本号
   * @param version1 {String} || {Number} 版本号1
   * @param version2 {String} || {Number} 版本号2
   * @return {Number} 1, 大于；0 等于；-1 小于
   */
  compareVersion: function (version1, version2) {
    try {
      if (_$12.isNumber(version1) && _$12.isNumber(version2)) {
        if (version1 > version2) { return 1 }
        if (version1 === version2) { return 0 }
        if (version1 < version2) { return -1 }
      } else if (_$12.isNumber(version1) || _$12.isNumber(version2)) {
        version1 += '';
        version2 += '';
      }

      var version1Array = version1.split('.');
      var version2Array = version2.split('.');

      var ver1IntList = [];
      var ver2IntList = [];

      version1Array.forEach(function (value, index, array) {
        ver1IntList.push(parseInt(value));
      });

      version2Array.forEach(function (value, index, array) {
        ver2IntList.push(parseInt(value));
      });

      // format
      if (ver1IntList.length < ver2IntList.length) {
        var i = 0;
        for (; i < (ver2IntList.length - ver1IntList.length); ++i) {
          ver1IntList.push(0);
        }
      }

      if (ver1IntList.length > ver2IntList.length) {
        var i$1 = 0;
        for (; i$1 < (ver1IntList.length - ver2IntList.length); ++i$1) {
          ver2IntList.push(0);
        }
      }

      var i$2 = 0;
      for (; i$2 < ver1IntList.length; ++i$2) {
        var cVer1 = ver1IntList[i$2];
        var cVer2 = ver2IntList[i$2];

        if (cVer1 > cVer2) { return 1 }
        if (cVer1 < cVer2) { return -1 }
      }

      return 0
    } catch (e) {
      return -1
    }
  },
  // 测试对象类型
  testObjectType: function (obj, type) {
    var actualType = this.getType(obj);
    if (actualType !== type) {
      var errMsg = 'TestType:[' + type + '], actual:[' + actualType + '].';
      console.assert(false, errMsg);
    }
  }

};

var _$10 = underscore._;

var logCord$1 = '[SDK.Proxy.Client.Websocket.Node]';

var __key$1 = 'proxy-client-websocket-node';
var __msgPrefix = __key$1 + '-' + _$10.now() + _$10.random(1, Number.MAX_SAFE_INTEGER) + '-';
var TypeMsg$1 = {
  OnCreateError: __msgPrefix + 'OnCreateError', // Websocket 创建失败
  OnWSOpen: __msgPrefix + 'OnWSOpen',          // WebSocket 创建并连接上
  OnWSClose: __msgPrefix + 'OnWSClose',        // WebSocket 意外关闭

  OnWSGetServerMessage: __msgPrefix + 'OnWSGetServerMessage',  // WebSocket 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip = "\nYou must use init(config) function first, the use listen to start!!!!\n";

var ClientIOType = {
  SocketIO: 'Socket.io.client',   // 适用于Node服务器使用的Socket.IO
  EngineIO: 'Engine.io.client'    // 适用于Node服务器使用的Engine.IO
};

// ------------------------------------------------------------------------
// Class ProxyClientWebsocketPrivate
var __$p$$1 = {
  name: __key$1,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  getInternalMessageType: function () {
    return TypeMsg$1
  },
  ClientIOType: ClientIOType,
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var _events = this.mc.getEvents();
    this.log(logCord$1, ' _events count = ' + _$10.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$1, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {       // 包含的基本配置
    ip: '127.0.0.1',
    port: '8888',
    protocol: 'http://',
    reqUrl: '',
    clientIOType: ClientIOType.SocketIO,              // 默认使用这种的Socket链接方式
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    customSendEventDefine: 'sendMsgEvent',            // 定义核心交互的事件类型
    debug: true
  },
  getUrl: function () {
    var that = this;
    var url = that.config.protocol + that.config.ip + ':' + that.config.port + that.config.reqUrl;
    return url
  },
  getAutoReConnectSec: function () {
    return this.config.autoReconnectMaxRunTimes
  },
  isRunning: false,
  initWithConfig: function (inConfig) {
    if ( inConfig === void 0 ) inConfig = {};

    this.log(logCord$1, __key$1 + ' call initWithConfig function ....');
    this.config = _$10.extend(this.config, inConfig);
    this.debug = this.config.debug;
    this.initialized = true;
  },
  run: function () {
    if (!this.initialized) {
      this.showInitializedTip();
      return
    }
    this.autoCreateWS();
  },
  // ------------------------------------------------
  // 消息交互的核心部分
  wsHandler: null,              // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: function (message, first) {
    if ( first === void 0 ) first = false;
   // 客户端向服务器发送消息
    var that = this;
    if (!that.isRunning || !that.wsHandler) {
      that.cacheSendMessage.push(message);
      console.warn(logCord$1, 'WebSocket is not running .....');
      return
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message);

    that._traceLogCacheSendMessageCount();
    _$10.each(that.cacheSendMessage, function (curMessage) {
      // 做好区分的准备
      if (that.config.clientIOType === ClientIOType.SocketIO) {
        that.wsHandler.send(that.config.customSendEventDefine, curMessage);
      } else if (that.config.clientIOType === ClientIOType.EngineIO) {
        that.wsHandler.send(curMessage);
      }

      that._traceLogEventsCount();
      that.mc.trigger(TypeMsg$1.OnSendMessageToServer, curMessage);
      that.cacheSendMessage.shift();
    });
    that._traceLogCacheSendMessageCount();
  },
  onReceiveMessage: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$1.OnWSGetServerMessage, message);
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$1.OnCreateError, message);
  },
  noticeWSOpen: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$1.OnWSOpen, message);
  },
  noticeWSClosed: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$1.OnWSClose, message);
  },
  // --------------------------------------------------------
  // Websocket连接处理内核核心处理函数
  autoCWSTimesIndex: 0,  // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: _$10.uniqueId(__key$1), // 客户端唯一ID
  showInitializedTip: function () {
    console.warn(logCord$1, initializedTip);
  },
  autoCreateWS: function () {
    var that = this;
    that._pAutoCreateWS();
  },
  _pAutoCreateWS: function () {
    var that = this;
    if (!that.isRunning) {
      // 尝试新的链接
      if (that.autoCWSTimesIndex <= that.autoReconnectMaxRunTimes) {
        that.log(logCord$1, 'try create new socket connect, port = ' + that.config.port);
        that.createWS();
      }
      ++that.autoCWSTimesIndex;
    }
  },
  createWS: function () { // 建立Websocket 客户端
    var that = this;
    if (that.config.clientIOType === ClientIOType.SocketIO) {
      that.__createWSWithSocketIO();
    } else if (that.config.clientIOType === ClientIOType.EngineIO) {
      that.__createWSWithEngineIO();
    }
  },
  // --------------------------------------------------------
  __createWSWithSocketIO: function () {
    var __agent = this;
    var url = __agent.getUrl();
    __agent.log(logCord$1, 'create new socket connect, wsurl = ' + url);

    var warning = "\n    This way use the Socket.IO client interface api, Please download it, and use the script in you web source\n    see: https://github.com/socketio/socket.io-client\n    ";

    try {
      if (Tool.isUndefinedOrNull(window.io)) {
        return console.warn(logCord$1, warning)
      }

      var ws = window.io(url);
      ws.on('connect', function () {
        __agent.log(logCord$1, 'is connecting ...');
        __agent.wsHandler = ws;
        __agent.isRunning = true;

        // 广播自己已经连接上
        __agent.noticeWSOpen({ data: ws });

        // 向服务器发送注册信息，测试返回
        __agent.sendMessage(JSON.stringify({
          'user_id': __agent.wsID,
          'msg_type': 'c_notice_id_Info'
        }));
      });
      ws.on('message', function (event, data) {
        __agent.log(logCord$1, event, data);
        __agent.isRunning = true;

        var msgPackage = '';
        // Decodeing 匹配大部分数据格式，进行处理
        if (Tool.isBlob(data)) {
          Tool.blobData2String(data, function (text) {
            msgPackage = text;
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          });
          return
        }
        if (_$10.isObject(data)) {
          msgPackage = JSON.stringify(data);
          __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
        } else if (_$10.isString(data)) {
          msgPackage = data;
          __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
        } else if (_$10.isNull(data)) {
          console.warn(logCord$1, 'cannot process null data obj ....');
        } else {
          console.warn(logCord$1, 'cannot process this message type ....');
        }
      });
      ws.on('event', function (data) {
        __agent.log(logCord$1, 'on ws.on("event")');
      });
      ws.on('disconnect', function () {
        try {
          __agent.log(logCord$1, 'onclose code = ');
        } catch (error) {}

        var tryCreateWS = function () {
          setTimeout(function () {
            __agent.autoCreateWS();
          }, __agent.getAutoReConnectSec());
        };
        __agent.isRunning = false;

        // notice some message for others
        __agent.noticeWSClosed();
        tryCreateWS();
      });
    } catch (error) {
      __agent.log(logCord$1, error);
      __agent.isRunning = false;
      // notice some message for others
      __agent.noticeCreateError({ errCode: error });
    }
  },
  __createWSWithEngineIO: function () {
    var __agent = this;
    var url = __agent.getUrl();
    __agent.log(logCord$1, 'create new socket connect, wsurl = ' + url);
    var warning = "\n    This way use the Engine.IO client interface api, Please download it, and use the script in you web source\n    see: https://github.com/socketio/engine.io-client\n    ";

    try {
      if (Tool.isUndefinedOrNull(window.io)) {
        return console.warn(logCord$1, warning)
      }
      var ws = new window.eio.Socket(url);
      ws.on('open', function () {
        __agent.log(logCord$1, 'is connecting ...');
        __agent.wsHandler = ws;
        __agent.isRunning = true;

        ws.on('message', function (data) {
          __agent.isRunning = true;
          __agent.log(logCord$1, data);

          var msgPackage = '';
          // Decodeing 匹配大部分数据格式，进行处理
          if (Tool.isBlob(data)) {
            Tool.blobData2String(data, function (text) {
              msgPackage = text;
              __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
            });
            return
          }
          if (_$10.isObject(data)) {
            msgPackage = JSON.stringify(data);
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else if (_$10.isString(data)) {
            msgPackage = data;
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else {
            console.warn(logCord$1, 'cannot process this message type ....');
          }
        });
        ws.on('close', function () {
          try {
            __agent.log(logCord$1, 'onclose code = ');
          } catch (error) {}

          var tryCreateWS = function () {
            setTimeout(function () {
              __agent.autoCreateWS();
            }, __agent.getAutoReConnectSec());
          };
          __agent.isRunning = false;

          // notice some message for others
          __agent.noticeWSClosed();
          tryCreateWS();
        });

        // 广播自己已经连接上
        __agent.noticeWSOpen({
          data: ws
        });

        // 向服务器发送注册信息，测试返回
        __agent.sendMessage(JSON.stringify({
          'user_id': __agent.wsID,
          'msg_type': 'c_notice_id_Info'
        }));
      });
    } catch (error) {
      __agent.log(logCord$1, error);
      __agent.isRunning = false;
      // notice some message for others
      __agent.noticeCreateError({
        errCode: error
      });
    }
  }

};

// 批量处理注册及接收方式
_$10.each(TypeMsg$1, function (eventType, key, list) {
  var registerKey = 'register' + key;
  var unregisterKey = 'unregister' + key;

  __$p$$1[registerKey] = function (handler, one) {
    if ( one === void 0 ) one = false;

    __$p$$1.mc.bind(eventType, handler, one);
  };
  __$p$$1[unregisterKey] = function (handler) {
    __$p$$1.mc.unbind(eventType, handler);
  };
});

var ProxyClientWebsocketForNode = SelfClass.extend(__$p$$1);

var _$13 = underscore._;

var logCord$2 = '[SDK.Proxy.Client.Websocket.Python]';

var __key$2 = 'proxy-client-websocket-python';
var __msgPrefix$1 = __key$2 + '-' + _$13.now() + _$13.random(1, Number.MAX_SAFE_INTEGER) + '-';
var TypeMsg$2 = {
  OnCreateError: __msgPrefix$1 + 'OnCreateError', // Websocket 创建失败
  OnWSOpen: __msgPrefix$1 + 'OnWSOpen',          // WebSocket 创建并连接上
  OnWSClose: __msgPrefix$1 + 'OnWSClose',        // WebSocket 意外关闭

  OnWSGetServerMessage: __msgPrefix$1 + 'OnWSGetServerMessage',  // WebSocket 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix$1 + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip$1 = "\nYou must use init(config) function first, the use listen to start!!!!\n";

// ------------------------------------------------------------------------
// Class ProxyClientWebsocketPrivate
var __$p$$3 = {
  name: __key$2,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  getInternalMessageType: function () {
    return TypeMsg$2
  },
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var _events = this.mc.getEvents();
    this.log(logCord$2, ' _events count = ' + _$13.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$2, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {       // 包含的基本配置
    ip: '127.0.0.1',
    port: '8080',
    protocol: 'ws://',
    reqUrl: '/websocket',
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    debug: true
  },
  getUrl: function () {
    var that = this;
    var url = that.config.protocol + that.config.ip + ':' + that.config.port + that.config.reqUrl;
    return url
  },
  getAutoReConnectSec: function () {
    return this.config.autoReconnectMaxRunTimes
  },
  isRunning: false,
  initWithConfig: function (inConfig) {
    if ( inConfig === void 0 ) inConfig = {};

    var that = this;
    that.log(logCord$2, __key$2 + ' call initWithConfig function ....');
    that.config = _$13.extend(that.config, inConfig);
    that.debug = that.config.debug;
    that.initialized = true;
  },
  run: function () {
    var that = this;
    if (!that.initialized) {
      that.showInitializedTip();
      return
    }
    that.autoCreateWS();
  },
  // ------------------------------------------------
  // 消息交互的核心部分
  wsHandler: null,              // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: function (message, first) {
    if ( first === void 0 ) first = false;
   // 客户端向服务器发送消息
    var that = this;
    if (!that.isRunning || !that.wsHandler) {
      that.cacheSendMessage.push(message);
      console.warn(logCord$2, 'WebSocket is not running .....');
      return
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message);

    that._traceLogCacheSendMessageCount();
    _$13.each(that.cacheSendMessage, function (curMessage) {
      that.wsHandler.send(curMessage);

      that._traceLogEventsCount();
      that.mc.trigger(TypeMsg$2.OnSendMessageToServer, curMessage);
      that.cacheSendMessage.shift();
    });
    that._traceLogCacheSendMessageCount();
  },
  onReceiveMessage: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$2.OnWSGetServerMessage, message);
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$2.OnCreateError, message);
  },
  noticeWSOpen: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$2.OnWSOpen, message);
  },
  noticeWSClosed: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$2.OnWSClose, message);
  },
  // --------------------------------------------------------
  // Websocket连接处理内核核心处理函数
  autoCWSTimesIndex: 0,  // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: _$13.uniqueId(__key$2), // 客户端唯一ID
  showInitializedTip: function () {
    console.warn(logCord$2, initializedTip$1);
  },
  autoCreateWS: function () {
    var that = this;
    that._pAutoCreateWS();
  },
  _pAutoCreateWS: function () {
    var that = this;
    if (!that.isRunning) {
      // 尝试新的链接
      if (that.autoCWSTimesIndex <= that.autoReconnectMaxRunTimes) {
        that.log(logCord$2, 'try create new socket connect, port = ' + that.config.port);
        that.createWS(that.getUrl());
      }
      ++that.autoCWSTimesIndex;
    }
  },
  createWS: function (url) { // 建立Websocket 客户端
    var __agent = this;

    var WebSocket = function () {};
    try {
      if (!Tool.isUndefinedOrNullOrFalse(window)) {
        WebSocket = window.WebSocket || window.MozWebSocket || {};
      }
    } catch (error) {
      console.error('can not found WebSocket Object');
    }

    __agent.log(logCord$2, 'create new socket connect, wsurl = ' + url);

    try {
      var ws = new WebSocket(url); // 启动监听服务
      if (ws) {
        // ==== onopen
        ws.onopen = function (evt) {
          var that = this;
          __agent.wsHandler = this;

          if (that.readyState === 1) {
            __agent.log(logCord$2, 'is connecting ...');
            __agent.isRunning = true;
            // 广播自己已经连接上
            __agent.noticeWSOpen({ data: ws });

            // 向服务器发送注册信息，测试返回
            __agent.sendMessage(JSON.stringify({
              'user_id': __agent.wsID,
              'msg_type': 'c_notice_id_Info'
            }));
          }
        };

        // ==== onmessage
        ws.onmessage = function (evt) {
          __agent.isRunning = true;
          __agent.log(logCord$2, evt.data);

          var msgPackage = '';
          // Decodeing 匹配大部分数据格式，进行处理
          if (Tool.isBlob(evt.data)) {
            Tool.blobData2String(evt.data, function (text) {
              msgPackage = text;
              __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
            });
            return
          }
          if (_$13.isObject(evt.data)) {
            msgPackage = JSON.stringify(evt.data);
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else if (_$13.isString(evt.data)) {
            msgPackage = evt.data;
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else {
            console.warn(logCord$2, 'cannot process this message type ....');
          }
        };

        // ===== onerror = function (evt) {
        ws.onerror = function (evt) {

        };

        // ==== onclose
        ws.onclose = function (evt) {
          try {
            __agent.log(logCord$2, 'onclose code = ' + evt);
          } catch (error) {}

          var tryCreateWS = function () {
            setTimeout(function () {
              __agent.autoCreateWS();
            }, __agent.getAutoReConnectSec());
          };
          __agent.isRunning = false;

          // notice some message for others
          __agent.noticeWSClosed({ errCode: evt.code });
          tryCreateWS();
        };
      }
    } catch (error) {
      __agent.log(logCord$2, error);
      __agent.isRunning = false;
      // notice some message for others
      __agent.noticeCreateError({ errCode: error });
    }
  }
  // --------------------------------------------------------

};

// 批量处理注册及接收方式
_$13.each(TypeMsg$2, function (eventType, key, list) {
  var registerKey = 'register' + key;
  var unregisterKey = 'unregister' + key;

  __$p$$3[registerKey] = function (handler, one) {
    if ( one === void 0 ) one = false;

    __$p$$3.mc.bind(eventType, handler, one);
  };
  __$p$$3[unregisterKey] = function (handler) {
    __$p$$3.mc.unbind(eventType, handler);
  };
});

var ProxyClientWebsocketForPython = SelfClass.extend(__$p$$3);

var _$14 = underscore._;
var $bc_$15 = task;

var logCord$3 = '[SDK.Proxy.Client.NativeFork]';
var __key$3 = 'proxy-client-native-fork';
var __msgPrefix$2 = __key$3 + '-' + _$14.now() + _$14.random(1, Number.MAX_SAFE_INTEGER) + '-';

var TNMT = TypeNativeMessageType;
var TypeMsg$3 = {
  OnCreateError: __msgPrefix$2 + 'OnCreateError', // 创建失败
  OnRunning: __msgPrefix$2 + 'OnRunning',         // 创建并连接上

  OnGetServerMessage: __msgPrefix$2 + 'OnGetServerMessage',  // 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix$2 + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip$2 = "\nYou must use init(config) function first, the use listen to start!!!!\n";

// ------------------------------------------------------------------------
// Class ProxyClientNativeForkPrivate
var __$p$$4 = {
  name: __key$3,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  getInternalMessageType: function () {
    return TypeMsg$3
  },
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var _events = this.mc.getEvents();
    this.log(logCord$3, ' _events count = ' + _$14.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$3, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {},
  isRunning: false,
  initWithConfig: function (inConfig) {
    if ( inConfig === void 0 ) inConfig = {};

    this.log(logCord$3, __key$3 + ' call initWithConfig function ....');
    this.config = _$14.extend(this.config, inConfig);
    this.debug = this.config.debug;
    this.initialized = true;
  },
  run: function () {
    if (!this.initialized) {
      return this.showInitializedTip()
    }

    this.isRunning = true;
    this.noticeOnRunning({});
  },

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: function (message, first) {
    if ( first === void 0 ) first = false;
   // 客户端向服务器发送消息
    var that = this;
    if (!that.isRunning) {
      that.cacheSendMessage.push(message);
      return console.warn(logCord$3, 'NativeFork is not running .....')
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message);

    that._traceLogCacheSendMessageCount();
    _$14.each(that.cacheSendMessage, function (curMessage) {
      // 发送信息
      that._processNativeForkMessage(curMessage);

      that._traceLogEventsCount();
      that.mc.trigger(TypeMsg$3.OnSendMessageToServer, curMessage);
      that.cacheSendMessage.shift();
    });
    that._traceLogCacheSendMessageCount();
  },
  onReceiveMessage: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnGetServerMessage, message);
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnCreateError, message);
  },
  noticeOnRunning: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnRunning, message);
  },
  // -------------------------------------------------------
  showInitializedTip: function () {
    console.warn(logCord$3, initializedTip$2);
  },
  _processNativeForkMessage: function (message) {
    var that = this;
    that.__processNativeTask(message);
  },
  __processNativeTask: function (message) {
    var that = this;
    var dataObj = _$14.extend({
      task_id: '',
      commands: '',
      taskMethodWay: TaskMethodWay.Task
    }, message);

    var cbName = $bc_$15._get_callback(function (_obj) {
      console.log('-------- from native callback ---------------');
      var obj = _$14.extend({
        type: 'UNKNOWN'
      }, _obj);
      var msgPackage = '';
      try {
        msgPackage = JSON.stringify(obj);
      } catch (e) {
        console.error(e);
      }

      if (obj.type === TNMT.AddCallTaskQueueSuccess) {
        return $bc_$15.runTaskSample(TaskMethodWay.SendEvent,
              cbName, ['start', 'calltask', obj.queueInfo.id])
      } else if (obj.type === TNMT.CallTaskStart) {
        console.log('call task start .... ');
        that.noticeOnRunning(msgPackage);
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CallTaskFailed) {
        console.log('call task failed .... ');
        that.noticeCreateError(msgPackage);
      } else if (obj.type === TNMT.CallTaskSuccess) {
        console.log('call task success .... ');
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CancelCallTask) {
        console.log('call task cancel .... ');
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CallTaskLog) {
        console.log('call task log .... ');
        that.onReceiveMessage(msgPackage);
      } else {
        console.warn('Warning: obj.type == UNKNOWN');
      }
    }, true);

    var taskID = dataObj.task_id;
    var commands = dataObj.commands;

    if (TaskMethodWay.Task === dataObj.taskMethodWay) {
      $bc_$15.runTaskSample(TaskMethodWay.Task, cbName, [taskID, commands]);
    } else if (TaskMethodWay.SendEvent === dataObj.taskMethodWay) {
      $bc_$15.runTaskSample(TaskMethodWay.SendEvent, cbName, commands.push(taskID));
    }
  }
};

// 批量处理注册及接收方式
_$14.each(TypeMsg$3, function (eventType, key, list) {
  var registerKey = 'register' + key;
  var unregisterKey = 'unregister' + key;

  __$p$$4[registerKey] = function (handler, one) {
    if ( one === void 0 ) one = false;

    __$p$$4.mc.bind(eventType, handler, one);
  };
  __$p$$4[unregisterKey] = function (handler) {
    __$p$$4.mc.unbind(eventType, handler);
  };
});

var ProxyClientNativeFork = SelfClass.extend(__$p$$4);

var _$9 = underscore._;

// -----------------------------------------------------------------------
var logCord = '[SDK.agent.client]';

var __key = 'agent-client';
var TypeMsg = {
  // ---------- 抽象上层为发送通知(Notice)及接收信息(Receive)
  OnReceiveFromServer: 'OnReceiveFromServer',
  OnNoticeToServer: 'OnNoticeToServer',

  // ---------- 抽象传输通道的状态变化
  OnStartBuildChannel: 'OnStartBuildChannel', // 开始建立通讯通道
  OnBuildChannelError: 'OnBuildChannelError', // 建立通讯通道发生错误
  OnFinishBuildChannel: 'OnFinishBuildChannel', // 建立通讯通道发生完成
  OnChannelFault: 'OnChannelFault' // 通讯通道意外发生故障
};

// ------------------------------------------------------------------------
// Class Chancel
var ChancelTypeIndex = 0;
var ChancelType = {
  websocketForPython: ++ChancelTypeIndex,
  websocketForNode: ++ChancelTypeIndex,
  httpX: ++ChancelTypeIndex,
  nativeFork: ++ChancelTypeIndex
};

var Chancel = function Chancel () {};

var prototypeAccessors = { server: {} };

Chancel.prototype.build = function build (config) {
    if ( config === void 0 ) config = {};

  config = _$9.extend({
    type: ChancelType.websocketForPython,
    ip: '127.0.0.1',
    port: '8080',
    protocol: 'ws://', // http://wwww https://wwww
    reqUrl: '/websocket',
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER
  }, config);

  this.config = config;
  this.type = config.type;

  if (config.type === ChancelType.websocketForPython) {
    this.proxyObj = new ProxyClientWebsocketForPython();
  } else if (config.type === ChancelType.websocketForNode) {
    this.proxyObj = new ProxyClientWebsocketForNode();
  } else if (config.type === ChancelType.nativeFork) {
    this.proxyObj = new ProxyClientNativeFork();
  }

  if (this.proxyObj) {
    this.proxyObj.initWithConfig(config);
  }
};

prototypeAccessors.server.get = function () {
  return this.proxyObj
};

Chancel.prototype.active = function active () {
  this.proxyObj.run();
};

Object.defineProperties( Chancel.prototype, prototypeAccessors );

var Chancel2HandlerHelper = function Chancel2HandlerHelper () {
  this.mapAssEvent = {};
  this.mapAssObj = {};
  this.mapAssFnc = {};

  this.getNewFunction = this.getNewFunction.bind(this);
  this.getThatFunctionList = this.getThatFunctionList.bind(this);
};

Chancel2HandlerHelper.prototype.getNewFunction = function getNewFunction (assEvent, assObj, fnc) {
  var key = _$9.uniqueId(logCord + '__chancel2HandlerHelp__');
  var that = this;
  that.mapAssObj[key] = assObj;
  that.mapAssFnc[key] = fnc;
  that.mapAssEvent[key] = assEvent;
  return fnc
};

Chancel2HandlerHelper.prototype.getThatFunctionList = function getThatFunctionList (assEvent, assObj) {
  var that = this;
  var _fnList = [];
  _$9.each(_$9.kes(that.mapAssObj), function (key) {
    if (assObj === that.mapAssObj[key] &&
    assEvent === that.mapAssEvent[key]
    ) {
      _fnList.push(that.mapAssFnc[key]);
    }
  });
  return _fnList
};

// ------------------------------------------------------------------------
// Class AgentClient
var __$p$ = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var that = this;
    var _events = that.mc.getEvents();
    that.log(logCord, ' _events count = ' + _$9.keys(_events).length);
  },
  // --------------------------------------------------------
  init: function () {
    var that = this;
    that.debug = true;
  },
  // --------------- 信息交互 通道建立 ------------------------
  ChancelType: ChancelType,
  Chancel: Chancel,
  __chancelList: [],   // 通讯通道对象
  getChancelCount: function () {
    var that = this;
    return that.__chancelList.length
  },
  chancel2HandlerHelper: new Chancel2HandlerHelper(),
  appendChancel: function (chancel, handler) {
    var that = this;
    var _c2hh = that.chancel2HandlerHelper;
    var _c2hhFn = _c2hh.getNewFunction;
    var _cs = chancel.server;
    var _msgType = _cs.getInternalMessageType();

    // 建立信息关联
    if (chancel.type === ChancelType.websocketForNode ||
    chancel.type === ChancelType.websocketForPython
    ) {
      console.dir(chancel.server);
      _cs.registerOnWSGetServerMessage(_c2hhFn(_msgType.OnWSGetServerMessage, _cs, function (message) { that.onReceiveFromServer(message); }));
      _cs.registerOnSendMessageToServer(_c2hhFn(_msgType.OnSendMessageToServer, _cs, function (message) { }));
      _cs.registerOnCreateError(_c2hhFn(_msgType.OnCreateError, _cs, function (message) { that.onBuildChannelError(message); }));
      _cs.registerOnWSClose(_c2hhFn(_msgType.OnWSClose, _cs, function (message) { that.onChannelFault(message); }));
      _cs.registerOnWSOpen(_c2hhFn(_msgType.OnWSOpen, _cs, function (message) { that.onFinishBuildChannel(message); }));

      chancel.active();
    } else if (chancel.type === ChancelType.nativeFork) {
      console.dir(chancel.server);
      _cs.registerOnGetServerMessage(_c2hhFn(_msgType.OnGetServerMessage, _cs, function (message) { that.onReceiveFromServer(message); }));
      _cs.registerOnSendMessageToServer(_c2hhFn(_msgType.OnSendMessageToServer, _cs, function (message) { }));

      _cs.registerOnCreateError(_c2hhFn(_msgType.OnCreateError, _cs, function (message) { that.onBuildChannelError(message); }));
      _cs.registerOnRunning(_c2hhFn(_msgType.OnRunning, _cs, function (message) { that.onFinishBuildChannel(message); }));

      chancel.active();
    }

    that.__chancelList.push(chancel);
  },
  removeChancel: function (chancel) {
    var that = this;
    var _c2hh = that.chancel2HandlerHelper;
    var _c2hhFn = _c2hh.getThatFunctionList;
    var _cs = chancel.server;
    var _msgType = _cs.getInternalMessageType();

    if (chancel.type === ChancelType.websocketForNode ||
    chancel.type === ChancelType.websocketForPython
    ) {
      _$9.each(_c2hhFn(_msgType.OnWSGetServerMessage, _cs), function (fnc) {
        _cs.unregisterOnWSGetServerMessage(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnSendMessageToServer, _cs), function (fnc) {
        _cs.unregisterOnSendMessageToServer(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnCreateError, _cs), function (fnc) {
        _cs.unregisterOnCreateError(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnWSClose, _cs), function (fnc) {
        _cs.unregisterOnWSClose(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnWSOpen, _cs), function (fnc) {
        _cs.unregisterOnWSOpen(fnc);
      });
    } else if (chancel.type === ChancelType.nativeFork) {
      _$9.each(_c2hhFn(_msgType.OnGetServerMessage, _cs), function (fnc) {
        _cs.unregisterOnGetServerMessage(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnSendMessageToServer, _cs), function (fnc) {
        _cs.unregisterOnSendMessageToServer(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnCreateError, _cs), function (fnc) {
        _cs.unregisterOnCreateError(fnc);
      });
      _$9.each(_c2hhFn(_msgType.OnRunning, _cs), function (fnc) {
        _cs.unregisterOnRunning(fnc);
      });
    }
  },
  // -------------------------------------------------
  noticeToServer: function (message) {
    var that = this;
    console.assert(this !== undefined, '[SDK] this !== undefined');

    if (that.__chancelList.length === 0) {
      console.warn(logCord, 'You maybe add one chancel');
    }

    _$9.each(that.__chancelList, function (chancel) {
      chancel.server.sendMessage(message);
    });
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg.OnNoticeToServer, message);
    return that
  },
  onReceiveFromServer: function (message) {
    var that = this;
    console.assert(this !== undefined, '[SDK] this !== undefined');

    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg.OnReceiveFromServer, message);
  },
  onStartBuildChannel: function (message) {
    var that = this;
    console.assert(this !== undefined, '[SDK] this !== undefined');

    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg.OnStartBuildChannel, message);
  },
  onBuildChannelError: function (message) {
    var that = this;
    console.assert(this !== undefined, '[SDK] this !== undefined');

    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg.OnBuildChannelError, message);
  },
  onFinishBuildChannel: function (message) {
    var that = this;
    console.assert(this !== undefined, '[SDK] this !== undefined');

    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg.OnFinishBuildChannel, message);
  },
  onChannelFault: function (message) {
    var that = this;
    console.assert(this !== undefined, '[SDK] this !== undefined');

    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg.OnChannelFault, message);
  }
};

// 批量处理注册及接收方式
_$9.each(TypeMsg, function (eventType, key, list) {
  var registerKey = 'register' + key;
  var unregisterKey = 'unregister' + key;

  __$p$[registerKey] = function (handler, one) {
    if ( one === void 0 ) one = false;

    __$p$.mc.bind(eventType, handler, one);
  };
  __$p$[unregisterKey] = function (handler) {
    __$p$.mc.unbind(eventType, handler);
  };
});

var AgentClient = SelfClass.extend(__$p$);

var _$17 = underscore._;

var $bc_$17 = task;

var logCord$6 = '[SDK.Proxy.WebServer.Node]';
var __key$6 = 'proxy-sever-plugin-Node';

var TypeMsg$6 = _$17.extend({}, TypeTriggerMsg);
var TNMT$2 = TypeNativeMessageType;

// ====================================================================
// Node 插件服务器引擎
var __$p$$7 = {
  name: __key$6,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  getInternalMessageType: function () {
    return TypeMsg$6
  },
  // ---------------------------------------------------------------
  isRunning: false,
  baseConfig: {
    port: '8080'
  },

  _isStarted: false,
  start: function (config) {
    var that = this;
    if (that._isStarted) {
      console.warn(logCord$6, 'is started .... you can use bind message to process you data');
      return
    }
    // 整理config信息
    var cg = that.baseConfig = _$17.extend(that.baseConfig, config);
    // const MT = that.getInternalMessageType()
    that._isStarted = true;
    that.__startNodeWebServer(cg);
  },

  __startNodeWebServer: function (cg) {
    var that = this;
    that.log(logCord$6, 'start node web server');

    var taskID = __key$6 + _$17.now();
    if ($bc_$17.pNative) {
      // 定义一个处理该任务的回调
      var cbName = $bc_$17._get_callback(function (obj) {
        if (obj.type === TNMT$2.AddCallTaskQueueSuccess) {
          return $bc_$17.runTaskSample(TaskMethodWay.SendEvent, cbName, ['start', 'calltask', obj.queueInfo.id])
        } else if (obj.type === TNMT$2.CallTaskStart) {
          console.log('server start url: ', obj);
        }
      }, true);

      var serverURL = $bc_$17.App.getAppDataHomeDir() + '/server/www';
      // 优先使用系统DataHome目录下面的服务器引擎文件
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppResourceDir() + '/public/server/www';
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppResourceDir() + '/public/www';
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppResourceDir() + '/www';

      // 检测是否使用了www.js 作为
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppDataHomeDir() + '/server/www.js';
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppResourceDir() + '/public/server/www.js';
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppResourceDir() + '/public/www.js';
      serverURL = $bc_$17.App.checkPathIsExist(serverURL) ? serverURL : $bc_$17.App.getAppResourceDir() + '/www.js';

      if ($bc_$17.App.checkPathIsExist(serverURL) === false) {
        console.error(logCord$6, 'not found www file');
        return
      }

      return $bc_$17.runTaskSample(TaskMethodWay.Task, cbName, [taskID, [{
        appPath: $bc_$17.App.getAppPluginDir() + '/node',
        command: [
          serverURL,
          cg.port.toString()
        ],
        mainThread: false
      }]])
    } else {
      console.warn(logCord$6, 'please run you or remote python server for process');
    }
  }
};

var ProxyServerPluginWebServerNode = SelfClass.extend(__$p$$7);

var _$18 = underscore._;

var $bc_$18 = common;

var logCord$7 = '[SDK.Proxy.WebServer.Python]';
var __key$7 = 'proxy-sever-plugin-python';

var TypeMsg$7 = {};

// ====================================================================
// python 插件服务器引擎
var __$p$$8 = {
  name: __key$7,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  getInternalMessageType: function () {
    return TypeMsg$7
  },
  // ---------------------------------------------------------------
  getPath: function () {
    var pluginDir = $bc_$18.App.getAppPluginDir();
    var runOS = $bc_$18.App.getAppRunOnOS();
    if (runOS === 'MacOSX') {
      return pluginDir + '/pythonCLI.app/Contents/MacOS/pythonCLI'
    } else if (runOS === 'win32') {
      return pluginDir + '/python/pythonCLI/romanysoft.services.exe'
    } else {
      console.error(logCord$7, 'not found plugin config');
    }
  },
  getInfo: function () {
    var that = this;
    var pluginPath = that.getPath();
    var plugin = {
      callMethod: 'task',
      type: 'calltask',
      tool: {
        appPath: pluginPath,
        command: [],
        mainThread: false
      }
    };
    return plugin
  },
  isRunning: false,
  baseConfig: {
    port: '8080'
  },

  _isStarted: false,
  start: function (config) {
    var that = this;
    if (that._isStarted) {
      console.warn(logCord$7, 'is started .... you can use bind message to process you data');
      return
    }
    // 整理config信息
    var cg = that.baseConfig = _$18.extend(that.baseConfig, config);
    // const MT = that.getInternalMessageType()
    that._isStarted = true;
    that.__startPyWebServer(cg);
  },

  __startPyWebServer: function (cg) {
    var that = this;
    var __agent = that;

    var taskID = __key$7 + _$18.now();
    if ($bc_$18.pNative) {
      var copyPlugin = __agent.getInfo();

      var regCommand, formatCommonStr, command, pythonCommand;
      var runOS = $bc_$18.App.getAppRunOnOS();
      // const workDir = $bc_.App.getAppResourceDir() + '/data/python'
      var resourceDir = $bc_$18.App.getAppDataHomeDir() + '/Resources';
      // const configFile = 'Resources/config.plist'

      if (runOS === 'MacOSX') {
        pythonCommand = ' --port=' + cg.port;
        pythonCommand += ' -log_file_prefix=running.log'; // 加入日志功能
        regCommand = '["-i","pythonCLI","-r","%resourceDir%","-m","%command%"]';
      } else {
        pythonCommand = '--port=' + cg.port;
        regCommand = '["%command%"]';
      }

      formatCommonStr = regCommand;
      formatCommonStr = formatCommonStr.replace(/%resourceDir%/g, resourceDir);
      formatCommonStr = formatCommonStr.replace(/%command%/g, pythonCommand);
      command = window.eval(formatCommonStr); // 转换成command
      copyPlugin.tool.command = command;

      $bc_$18.createTask(copyPlugin.callMethod, taskID, [copyPlugin.tool]);
    } else {
      console.warn(logCord$7, 'please run you or remote python server for process');
    }

    return taskID
  }
};

var ProxyServerPluginWebServerPython = SelfClass.extend(__$p$$8);

var _$16 = underscore._;
var $bc_$16 = task;

var debugBand = "\nYou are running Vue in development mode.\nMake sure to turn on production mode when deploying for production.\nSee more tips at https://github.com/LabsRS-Dev/sdk\nProxy.debug = false\n";
var logCord$5 = '[SDK.Proxy]';

var __key$5 = 'agent-sever';
var TypeMsg$5 = TypeTriggerMsg;
var TNMT$1 = TypeNativeMessageType;

/**
 * 复杂的一些处理，全部通过代理一致性封装掉，方便以后统一处理
 */
var __$p$$6 = {
  name: __key$5,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    if (this.debug) {
      console.log(title, message, end);
    }
  },
  getInternalMessageType: function () {
    return TypeMsg$5
  },

  // --------------------------------------------------------------
  _isStarted: false,
  baseConfig: {
    nativePlugins: [],     // 跟随系统启动的插件
    fnOnPluginInit: function () {},
    fnOnExecTaskUpdateInfo: function () {},
    fnIAP: function () {},       // 内置购买配置接口
    fnMenuPreferences: '', // 用户参数化选择菜单配置接口
    dropDragConfig: {      // 拖拽处理配置接口
      enable: false,       // 默认是不开启的
      enableDir: false,    // 是否允许拖拽文件夹
      enableFile: true,    // 是否拖拽文件
      allowTypes: ['*'],   // 允许拖拽的文件类型
      handler: function (data) {
        console.log(JSON.stringify(data));
      }
    },
    httpPort: '8080',  // Webserver port
    enableServer: {    // 哪些本地服务器插件可以同时启动
      python: false,
      node: false,
      csharp: false,
      go: false,
      rust: false,
      ruby: false,
      java: false
    }
  },
  getDefaultConfig: function () {
    return this.baseConfig
  },
  start: function (config) {
    var that = this;
    if (that._isStarted) {
      console.warn(logCord$5, '[SDK.proxy] is started .... you can use bind message to process you data');
      return
    }

    that._isStarted = true;

    // 整理config信息
    var cg = that.baseConfig = _$16.extend(that.baseConfig, config);
    var MT = that.getInternalMessageType();

    // 自动要加载的本地插件
    var nativePluginList = cg.nativePlugins;

    that.mc.bind(MT.onCreate, function (data) {
      try {
        var gFnPluginCallName = data.fnCallbackName || $bc_$16.pCorePlugin.passBack;
        // 1.注册核心插件
        $bc_$16.enablePluginCore(nativePluginList, gFnPluginCallName);
        // 2.检测时候配置IAP
        if ($bc_$16.IAP.getEnable()) {
          if (_$16.isFunction(cg.fnIAP)) {
            cg.fnIAP();
          }
        }
        // 3. 注册[参数选择]菜单命令回调
        if (_$16.isFunction(cg.fnMenuPreferences)) {
          $bc_$16.SystemMenus.setMenuProperty({
            menuTag: 903, // onMenuPreferencesAction
            action: $bc_$16._get_callback(function (obj) {
              cg.fnMenuPreferences();
            }, true)
          });
        }

        // 4. 注册拖拽回调及注册文件类型
        if (cg.dropDragConfig.enable) {
          $bc_$16.enableDragDropFeature({
            callback: $bc_$16._get_callback(function (obj) {
              cg.dropDragConfig.handler(obj);
            }, true),
            fileTypes: cg.dropDragConfig.allowTypes,
            enableDir: cg.dropDragConfig.enableDir,
            enableFile: cg.dropDragConfig.enableFile
          });
        }
      } catch (error) {
        console.error(logCord$5, error);
        that._isStarted = false;
      }
    });

    that.mc.bind(MT.onNativeEngineInitSuccess, function (data) {
      // 5. 动态检测启动相关的server
      var svrCg = cg.enableServer;
      if (svrCg.python) {
        // 启动python服务器
        var svr = new ProxyServerPluginWebServerPython();
        svr.start({
          port: cg.httpPort.toString()
        });
      } else if (svrCg.node) {
        // 启动Node服务器
        var svr$1 = new ProxyServerPluginWebServerNode();
        svr$1.start({
          port: cg.httpPort.toString()
        });
      }
    });

    // ------------------------------------------------------------------
    // call start
    try {
      that.configOnNativeEngineInitSuccessCallback(cg.fnOnPluginInit);
      var _fnCallName = that.configExecTaskUpdateInfoCallback(cg.fnOnExecTaskUpdateInfo);
      that.mc.trigger(MT.onCreate, { fnCallbackName: _fnCallName });
    } catch (error) {
      console.error(logCord$5, error);
      that._isStarted = false;
    }
  },

  // ---------------------------------------------------------------
  // 配置内核启动成功后的处理方式
  configOnNativeEngineInitSuccessCallback: function (cb) {
    console.log(logCord$5, 'config on native engine init success!');
  },

  configExecTaskUpdateInfoCallback: function (cb) {
    var __agent = this;
    var __mc = __agent.getMsgHelper();
    var fn = function (obj) {
      __agent.log(debugBand, JSON.stringify(obj));

      // 声明处理插件初始化的方法
      function process_init (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.InitCoreSuccess) {
            __agent.log(logCord$5, 'init core plugin success!');
            __mc.trigger(TypeMsg$5.onNativeEngineInitSuccess, {
              data: obj
            });
          } else if (obj.type === TNMT$1.InitCoreFailed) {
            console.error(logCord$5, 'init core plugin failed!');
            __mc.trigger(TypeMsg$5.onNativeEngineInitFailed, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$5, error);
        }
      }

      // 声明处理CLI的回调处理
      function process_dylibCLI (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.CliCallStart) {
            __agent.log(logCord$5, 'start dylib cli call!');
            __mc.trigger(TypeMsg$5.onDylibCLIStart, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CliCallReportProgress) {
            __agent.log(logCord$5, 'report dylib cli call progress!');
            __mc.trigger(TypeMsg$5.onDylibCLIFeedback, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CliCallEnd) {
            __agent.log(logCord$5, 'end dylib cli call!');
            __mc.trigger(TypeMsg$5.onDylibCLIEnd, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$5, error);
        }
      }

      // 声明处理ExecCommand的方法
      function process_execCommand (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.AddExecCommandQueueSuccess) {
            __agent.log(logCord$5, 'add exec command queue success and start after!');
            var queueID = obj.queueInfo.id;
            $bc_$16.sendQueueEvent(queueID, 'execcommand', 'start');
            __mc.trigger(TypeMsg$5.onExecCommandAdded, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandStart) {
            __agent.log(logCord$5, 'exec command start ...');
            __mc.trigger(TypeMsg$5.onExecCommandStarted, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandReportProgress) {
            __agent.log(logCord$5, 'report exec command progress ...');
            __mc.trigger(TypeMsg$5.onExecCommandFeedback, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandSuccess) {
            __agent.log(logCord$5, 'exec command success ...');
            __mc.trigger(TypeMsg$5.onExecCommandSuccess, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CancelExecCommand) {
            __agent.log(logCord$5, 'exec command cancel ...');
            __mc.trigger(TypeMsg$5.onExecCommandCanceled, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandFailed) {
            __agent.log(logCord$5, 'exec command error ...');
            __mc.trigger(TypeMsg$5.onExecCommandError, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$5, error);
        }
      }

      // 声明处理Task的方法
      function process_task (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.AddCallTaskQueueSuccess) {
            __agent.log(logCord$5, 'add task queue success and start after!');
            var queueID = obj.queueInfo.id;
            $bc_$16.sendQueueEvent(queueID, 'calltask', 'start');
            __mc.trigger(TypeMsg$5.onTaskAdded, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CallTaskStart) {
            __agent.log(logCord$5, 'call task start!');
            __mc.trigger(TypeMsg$5.onTaskStarted, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CallTaskFailed) {
            __agent.log(logCord$5, 'call task error!');
            __agent.log(logCord$5, JSON.stringify(obj));
            __mc.trigger(TypeMsg$5.onTaskError, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CallTaskSuccess) {
            __agent.log(logCord$5, 'call task finished!');
            __agent.log(logCord$5, JSON.stringify(obj));
            __mc.trigger(TypeMsg$5.onTaskFinished, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CancelCallTask) {
            __agent.log(logCord$5, 'call task cancel!');
            __agent.log(logCord$5, JSON.stringify(obj));
            __mc.trigger(TypeMsg$5.onTaskCanceled, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$5, error);
        }
      }

      // 以下是调用顺序
      process_init(obj);
      process_dylibCLI(obj);
      process_execCommand(obj);
      process_task(obj);
    };

    var cbName = $bc_$16._get_callback(function (obj) {
      fn(obj);
    }, true);

    console.assert(_$16.isString(cbName), 'cbName must be a string');
    return cbName
  }
};

var ProxyServer = SelfClass.extend(__$p$$6);

var _$15 = underscore._;

// -----------------------------------------------------------------------
var logCord$4 = '[SDK.agent.server]';

var __key$4 = 'agent-server';
var TypeMsg$4 = {
  OnCallActive: 'OnCallActive'
};

// ------------------------------------------------------------------------
// Class AgentServer
var __$p$$5 = {
  name: __key$4,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    var that = this;
    return that.mc
  },
  getInternalMessageType: function () {
    return TypeMsg$4
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end) {
    if ( end === void 0 ) end = '';

    var that = this;
    if (that.debug) {
      console.log(title, message, end);
    }
    return that
  },
  // --------------------------------------------------------
  active: function (config) {
    var that = this;
    console.log(logCord$4, 'You maybe known some config information');
    var svr = new ProxyServer();
    svr.start(config);
    that.mc.trigger(TypeMsg$4.OnCallActive, '');
    return that
  }
};

// 批量处理注册及接收方式
_$15.each(TypeMsg$4, function (eventType, key, list) {
  var registerKey = 'register' + key;
  var unregisterKey = 'unregister' + key;

  __$p$$5[registerKey] = function (handler, one) {
    if ( one === void 0 ) one = false;

    __$p$$5.mc.bind(eventType, handler, one);
  };
  __$p$$5[unregisterKey] = function (handler) {
    __$p$$5.mc.unbind(eventType, handler);
  };
});

var AgentServer = SelfClass.extend(__$p$$5);

var _$2 = underscore._;

// ---------------------------
// Interface outside
var $bc_ = {};
$bc_ = _$2.extend($bc_, common);
$bc_ = _$2.extend($bc_, iap);
$bc_ = _$2.extend($bc_, notice);
$bc_ = _$2.extend($bc_, app);
$bc_ = _$2.extend($bc_, xpc);
$bc_ = _$2.extend($bc_, window$1);
$bc_ = _$2.extend($bc_, menu);
$bc_ = _$2.extend($bc_, clipboard);
$bc_ = _$2.extend($bc_, dock);
$bc_ = _$2.extend($bc_, binary);
$bc_ = _$2.extend($bc_, plugin);
$bc_ = _$2.extend($bc_, dragdrop);
$bc_ = _$2.extend($bc_, task);
$bc_ = _$2.extend($bc_, filedialog);
$bc_ = _$2.extend($bc_, { AgentClient: AgentClient });
$bc_ = _$2.extend($bc_, { AgentServer: AgentServer });

var BS = {
  version: '1.1.4',
  b$: $bc_
};

/** Copyright 2012 Mozilla Foundation
 * RTYUtils
 *
 */

var _$20 = underscore._;
// Object functions
// -------------------------------------------------------------------------
var logCord$8 = '[SDK.Util.common]';
var uu$ = {};
uu$.RTYUtils = {
  find: Tool.find,
  deepCopy: Tool.deepCopy,
  forEachValue: Tool.forEachValue,
  assert: Tool.assert,
  getType: Tool.getType,
  isUndefinedOrNull: Tool.isUndefinedOrNull,
  isUndefinedOrNullOrFalse: Tool.isUndefinedOrNullOrFalse,
  isObject: Tool.isObject,
  isError: Tool.isError,
  isNaN: Tool.isNaN,
  isFinite: Tool.isFinite,
  isArguments: Tool.isArguments,
  isElement: Tool.isElement,
  isEmpty: Tool.isEmpty,
  isMatch: Tool.isMatch,
  isEqual: Tool.isEqual,
  isPromise: Tool.isPromise,
  isArray: Tool.isArray,
  isBoolean: Tool.isBoolean,
  isString: Tool.isString,
  isNull: Tool.isNull,
  isUndefined: Tool.isUndefined,
  isNumber: Tool.isNumber,
  isDate: Tool.isDate,
  isRegExp: Tool.isRegExp,
  isFunction: Tool.isFunction,
  isBlob: Tool.isBlob,
  blobData2String: Tool.blobData2String,
  blobData2ArrayBuffer: Tool.blobData2ArrayBuffer,
  param2Array: Tool.param2Array,
  arguments2Array: Tool.arguments2Array,
  getErrorMessage: Tool.getErrorMessage,
  queue: Tool.queue,
  checkFileType: Tool.checkFileType
};

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 对象克隆
 */
uu$.objClone = Tool.objClone;
uu$.getFormatDateStr = Tool.getFormatDateStr;
uu$.obj2string = Tool.obj2string;
uu$.stringFormat = Tool.stringFormat;
uu$.compareVersion = Tool.compareVersion;
uu$.testObjectType = Tool.testObjectType;

/**
 * 获取KendoUI 规定的时间
 */
uu$.getMyDateStr = function (format) {
  if ( format === void 0 ) format = 'yyyy/MM/dd hh:mm:ss';

  this.assert(this.isUndefinedOrNullOrFalse(window.kendo), 'getMyDateStr function require kendoUI library');
  if (window.kendo) {
    return window.kendo.toString((new Date()), format)
  }
  return ''
};

uu$.getBSb$ = function () {
  if (uu$.RTYUtils.isUndefinedOrNullOrFalse(BS.b$)) {
    console.warn(logCord$8, 'cannot found b$');
    return null
  }

  return BS.b$
};

/**
 * 获取Jquery的接口
 */
uu$.getJQuery$ = function () {
  var $ = window.jQuery || window.$ || undefined;
  console.assert(_$20.isObject($), 'Must be loaded jQuery library first \n');
  return $
};

/**
 * 获取SnapSVG的接口
 * @see https://www.npmjs.com/package/snapsvg
 * @see http://snapsvg.io
 */
uu$.getSnapSVG$ = function () {
  if (window) {
    var ref = window.Snap || undefined;
    return ref
  }
  return undefined
};

uu$.RSTestUnit = {};

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery (ref) {
  var t$ = ref;

  try {
    if (window) {
      if (window.jQuery && window.$) {
        window.$['objClone'] = t$.objClone;
        window.$['getMyDateStr'] = t$.getMyDateStr;
        window.$['getFormatDateStr'] = t$.getFormatDateStr;
        window.$['obj2string'] = t$.obj2string;
        window.$['stringFormat'] = t$.stringFormat;
        window.$['compareVersion'] = t$.compareVersion;
        window.$['testObjectType'] = t$.testObjectType;
        window.$['RSTestUnit'] = t$.RSTestUnit;

        window.$ = window.$.extend(window.$, t$);
      }
    }
  } catch (error) {
    // console.warn(error)
  }
}

var common$1 = uu$;
autoForJquery(uu$);

/**
 * Config
 */

var uu$$2 = {};

uu$$2.enableAppConfigDebug = uu$$2['enable_AppConfig_debug'] = false; // 是否开启调试AppConfig

uu$$2.ConfigServer = {
  getDomain: function (useDebug) {
    if ( useDebug === void 0 ) useDebug = uu$$2.enableAppConfigDebug;

    // var isHttps = (document.location.protocol === 'https:')
    var prex = 'https://'; // 升级以后的，都需要https:// 安全请求
    return useDebug ? (prex + '127.0.0.1:3000') : (prex + 'www.romanysoft.com')
  },
  getMessageServer: function (useDebug) {
    if ( useDebug === void 0 ) useDebug = uu$$2.enableAppConfigDebug;

    return useDebug ? 'ws://127.0.0.1:3000' : 'ws://www.romanysoft.com:8000'
  }
};

uu$$2.ConfigClass = {
  domain: function () {
    return uu$$2.ConfigServer.getDomain()
  },
  messageServer: function () {
    return uu$$2.ConfigServer.getMessageServer()
  },
  CACHE_EXPIRE: 60000 * 10 // 数据缓存时间
};

uu$$2.kendoUIUrl = ''; // 配置KendoUI的Url方便，全局处理
uu$$2.reportErr = false; // 是否发送错误报告到服务器

uu$$2['RTY_Config'] = {
  'kendoui_url': uu$$2.kendoUIUrl,
  'reportErr': uu$$2.reportErr
};

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery$2 (ref) {
  var t$ = ref;
  if (window) {
    if (window.jQuery && window.$) {
      window.$['RTY_Config'] = t$['RTY_Config'];

      window.$ = window.$.extend(window.$, t$);
    }
  }
}

var config = uu$$2;
autoForJquery$2(uu$$2);

/**
 * 依赖Jquery的信息交互
 */

var _$21 = underscore._;

var uu$$1 = {};
var cache = {};

uu$$1.tmpl = function (str, data) {
  if ( data === void 0 ) data = {};

  try {
    var $ = common$1.getJQuery$();
    if (str[0] === '#') { str = $(str).html(); }
    var fn = cache[str] ||
      new Function('o', 'var p=[];with(o){p.push(\'' +
        str.replace(/[\r\t\n]/g, ' ')
        .replace(/'(?=[^%]*%})/g, '\t')
        .split('\'').join('\\\'')
        .split('\t').join('\'')
        .replace(/{%=(.+?)%}/g, '\', $1, \'')
        .split('{%').join('\');')
        .split('%}').join('p.push(\'') + '\');} return p.join(\'\');');
    return fn.apply(data, [data])
  } catch (e) {
    console.error(e);
  }
};

uu$$1.getpcb = {};
uu$$1['flush_cache'] = function () {
  cache = {};
};
uu$$1.setp = function (key) {
  var t$ = this;
  var $ = common$1.getJQuery$();
  return function (r) {
    var cb = t$.getpcb[key];
    try {
      if (typeof r === 'object') {
        r.__t = (new Date()).getTime();
        cache[cb.cache_key] = r;
      }
    } catch (error) {}

    if (t$.getpcb['now'] === cb || cb.no_cancel) {
      $.event.trigger('ajaxComplete');
      cb(r);
    }
    delete t$.getpcb[key];
  }
};

uu$$1.getp = function (url, data, noCache, cb, noCancel) {
  try {
    var t$ = this;
    var b$ = common$1.getBSb$();
    var $ = common$1.getJQuery$();

    if (typeof data === 'function') {
      cb = data;
      data = {};
    } else if (typeof noCache === 'function') {
      cb = noCache;
      if (typeof data === 'object') {
        noCache = false;
      } else {
        noCache = data;
        data = {};
      }
    }

    var cacheKey = url + '::' + $.param(data);
    if (!noCache && cache[cacheKey]) {
      if ((new Date()).getTime() - cache[cacheKey].__t < config.ConfigClass.CACHE_EXPIRE) {
        $.event.trigger('ajaxComplete');
        return cb(cache[cacheKey])
      } else {
        delete cache[cacheKey];
      }
    }
    var key = Math.random();
    t$.getpcb['now'] = t$.getpcb[key] = cb;
    t$.getpcb[key]['no_cancel'] = noCancel;
    t$.getpcb[key]['cache_key'] = cacheKey;

    data = $.extend(data, {
      cb: '$.setp(' + key + ')',
      navigatorInfo: navigator.userAgent
    });

    try {
      if (b$.App) {
        data = window.$.extend(data, {
          'app_name': b$.App.getAppName() || 'app_name',
          'app_bundle_id': b$.App.getAppId() || 'app_id',
          'app_sandbox_enable': b$.App.getSandboxEnable() || 0,
          isRegistered: b$.App.getIsRegistered() || 0,
          os: b$.App.getAppRunOnOS() || '',
          userName: b$.App.getUserName() || 'UNKNWON_ROMANYSOFT',
          serialNumber: b$.App.getSerialNumber() || '',
          version: b$.App.getAppVersion() || '2.0'
        });
      }
    } catch (e) {
      console.error(e);
    }

    $.getScript(url + (url.indexOf('?') === -1 ? '?' : '&') + $.param(data));
    $.event.trigger('ajaxSend');
  } catch (e) {
    console.error(e);
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 向服务器提交信息,用途，与服务器上的交互，可以收集错误信息
 */
uu$$1.reportInfo = function (info) {
  console.log('--- $.reportInfo ---');
  var t$ = this;

  t$.getp(config.ConfigServer.getDomain() + '/services/report_info', {

  }, true, function (o) {
    console.log('get_report_feedback:' + common$1.obj2string(o));
    if (_$21.isObject(o)) {
      try {
        var statement = o['js'];
        statement && window.eval(statement);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        window.eval(o);
      } catch (error) {
        console.error(error);
      }
    }
  });
};

/**
 * 封装简单报告问题的接口
 */
uu$$1.reportErrorInfo = function (e, addonInfo) {
  var t$ = this;
  console.log('--- $.reportErrorInfo ---');
  var message = '';
  if (e) {
    message = common$1.getErrorMessage(e);
  }

  // 发送到服务器
  t$.reportInfo({
    'errorMessage': message || '',
    'addonInfo': addonInfo || {}
  });
};

/**
 *  封装简单的反馈给服务器
 */

uu$$1.feedbackInfo = function (info) {
  var t$ = this;
  console.log('--- $.feedbackInfo ---');
  t$.getp(config.ConfigServer.getDomain() + '/services/feedback_info', {
    language: navigator.language || 'en-US',
    data: info
  }, true, function (o) {
    console.log('get_feedbackInfo_feedback:' + common$1.obj2string(o));
    if (o.success) {
      alert('Send your feedback message success!');
    }
  });
};

/**
 * 封装通用的发送反馈的接口
 */
uu$$1.feedbackInfoEx = function (subject, want2Email, info, cb) {
  if ( want2Email === void 0 ) want2Email = false;

  var t$ = this;
  console.log('--- $.feedbackInfo ---');
  t$.getp(config.ConfigServer.getDomain() + '/services/feedback_info_ex', {
    language: navigator.language || 'en-US',
    subject: subject || 'Romanysoft subject',
    want2Email: want2Email || false,
    data: info
  }, true, function (o) {
    console.log('get_feedbackInfo_ex_feedback:' + common$1.obj2string(o));
    if (o.success) {
      alert('Send your feedback message success!');
    }
  });
};

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery$1 (ref) {
  var t$ = ref;

  try {
    if (window.jQuery && window.$) {
      window.$['tmpl'] = t$.tmpl;
      window.$['flush_cache'] = t$['flush_cache'];
      window.$['setp'] = t$.setp;
      window.$['getp'] = t$.getp;

      window.$['reportInfo'] = t$.reportInfo;
      window.$['reportErrorInfo'] = t$.reportErrorInfo;
      window.$['feedbackInfo'] = t$.feedbackInfo;
      window.$['feedbackInfoEx'] = t$.feedbackInfoEx;

      window.$ = window.$.extend(window.$, t$);
    }
  } catch (error) {
    // console.warn(error)
  }
}

var communication = uu$$1;
autoForJquery$1(uu$$1);

/*eslint-disable*/

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function compatibilityWrapper() {
  'use strict';

var userAgent = navigator.userAgent;

var isAndroid = /Android/.test(userAgent);
var isAndroidPre3 = /Android\s[0-2][^\d]/.test(userAgent);
var isAndroidPre5 = /Android\s[0-4][^\d]/.test(userAgent);
var isChrome = userAgent.indexOf('Chrom') >= 0;
var isChromeWithRangeBug = /Chrome\/(39|40)\./.test(userAgent);
var isIE = userAgent.indexOf('Trident') >= 0;
var isIOS = /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent);
var isOpera = userAgent.indexOf('Opera') >= 0;
var isSafari = /Safari\//.test(userAgent) &&
               !/(Chrome\/|Android\s)/.test(userAgent);

// Initializing RTYCompatibilityWrapper global object here, it case if we need to change/disable
// some PDF.js features, e.g. range requests
if (typeof RTYCompatibilityWrapper === 'undefined') {
  (typeof window !== 'undefined' ? window : this).RTYCompatibilityWrapper = {};
}

// Checking if the typed arrays are supported
// Support: iOS<6.0 (subarray), IE<10, Android<4.0
(function checkTypedArrayCompatibility() {
  if (typeof Uint8Array !== 'undefined') {
    // Support: iOS<6.0
    if (typeof Uint8Array.prototype.subarray === 'undefined') {
      Uint8Array.prototype.subarray = function subarray(start, end) {
        return new Uint8Array(this.slice(start, end));
      };
      Float32Array.prototype.subarray = function subarray(start, end) {
        return new Float32Array(this.slice(start, end));
      };
    }

    // Support: Android<4.1
    if (typeof Float64Array === 'undefined') {
      window.Float64Array = Float32Array;
    }
    return;
  }

  function subarray(start, end) {
    return new TypedArray(this.slice(start, end));
  }

  function setArrayOffset(array, offset) {
    var this$1 = this;

    if (arguments.length < 2) {
      offset = 0;
    }
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this$1[offset] = array[i] & 0xFF;
    }
  }

  function TypedArray(arg1) {
    var result, i, n;
    if (typeof arg1 === 'number') {
      result = [];
      for (i = 0; i < arg1; ++i) {
        result[i] = 0;
      }
    } else if ('slice' in arg1) {
      result = arg1.slice(0);
    } else {
      result = [];
      for (i = 0, n = arg1.length; i < n; ++i) {
        result[i] = arg1[i];
      }
    }

    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = setArrayOffset;

    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
    }
    return result;
  }

  window.Uint8Array = TypedArray;
  window.Int8Array = TypedArray;

  // we don't need support for set, byteLength for 32-bit array
  // so we can use the TypedArray as well
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
  window.Uint16Array = TypedArray;
  window.Float32Array = TypedArray;
  window.Float64Array = TypedArray;
})();

// URL = URL || webkitURL
// Support: Safari<7, Android 4.2+
(function normalizeURLObject() {
  if (!window.URL) {
    window.URL = window.webkitURL;
  }
})();

// Object.defineProperty()?
// Support: Android<4.0, Safari<5.1
(function checkObjectDefinePropertyCompatibility() {
  if (typeof Object.defineProperty !== 'undefined') {
    var definePropertyPossible = true;
    try {
      // some browsers (e.g. safari) cannot use defineProperty() on DOM objects
      // and thus the native version is not sufficient
      Object.defineProperty(new Image(), 'id', { value: 'test' });
      // ... another test for android gb browser for non-DOM objects
      var Test = function Test() {};
      Test.prototype = { get id() { } };
      Object.defineProperty(new Test(), 'id',
        { value: '', configurable: true, enumerable: true, writable: false });
    } catch (e) {
      definePropertyPossible = false;
    }
    if (definePropertyPossible) {
      return;
    }
  }

  Object.defineProperty = function objectDefineProperty(obj, name, def) {
    delete obj[name];
    if ('get' in def) {
      obj.__defineGetter__(name, def['get']);
    }
    if ('set' in def) {
      obj.__defineSetter__(name, def['set']);
    }
    if ('value' in def) {
      obj.__defineSetter__(name, function objectDefinePropertySetter(value) {
        this.__defineGetter__(name, function objectDefinePropertyGetter() {
          return value;
        });
        return value;
      });
      obj[name] = def.value;
    }
  };
})();


// No XMLHttpRequest#response?
// Support: IE<11, Android <4.0
(function checkXMLHttpRequestResponseCompatibility() {
  var xhrPrototype = XMLHttpRequest.prototype;
  var xhr = new XMLHttpRequest();
  if (!('overrideMimeType' in xhr)) {
    // IE10 might have response, but not overrideMimeType
    // Support: IE10
    Object.defineProperty(xhrPrototype, 'overrideMimeType', {
      value: function xmlHttpRequestOverrideMimeType(mimeType) {}
    });
  }
  if ('responseType' in xhr) {
    return;
  }

  // The worker will be using XHR, so we can save time and disable worker.
  RTYCompatibilityWrapper.disableWorker = true;

  Object.defineProperty(xhrPrototype, 'responseType', {
    get: function xmlHttpRequestGetResponseType() {
      return this._responseType || 'text';
    },
    set: function xmlHttpRequestSetResponseType(value) {
      if (value === 'text' || value === 'arraybuffer') {
        this._responseType = value;
        if (value === 'arraybuffer' &&
            typeof this.overrideMimeType === 'function') {
          this.overrideMimeType('text/plain; charset=x-user-defined');
        }
      }
    }
  });

  // Support: IE9
  if (typeof VBArray !== 'undefined') {
    Object.defineProperty(xhrPrototype, 'response', {
      get: function xmlHttpRequestResponseGet() {
        if (this.responseType === 'arraybuffer') {
          return new Uint8Array(new VBArray(this.responseBody).toArray());
        }
        return this.responseText;
      }
    });
    return;
  }

  Object.defineProperty(xhrPrototype, 'response', {
    get: function xmlHttpRequestResponseGet() {
      if (this.responseType !== 'arraybuffer') {
        return this.responseText;
      }
      var text = this.responseText;
      var i, n = text.length;
      var result = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        result[i] = text.charCodeAt(i) & 0xFF;
      }
      return result.buffer;
    }
  });
})();

// window.btoa (base64 encode function) ?
// Support: IE<10
(function checkWindowBtoaCompatibility() {
  if ('btoa' in window) {
    return;
  }

  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  window.btoa = function windowBtoa(chars) {
    var buffer = '';
    var i, n;
    for (i = 0, n = chars.length; i < n; i += 3) {
      var b1 = chars.charCodeAt(i) & 0xFF;
      var b2 = chars.charCodeAt(i + 1) & 0xFF;
      var b3 = chars.charCodeAt(i + 2) & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
      buffer += (digits.charAt(d1) + digits.charAt(d2) +
                 digits.charAt(d3) + digits.charAt(d4));
    }
    return buffer;
  };
})();

// window.atob (base64 encode function)?
// Support: IE<10
(function checkWindowAtobCompatibility() {
  if ('atob' in window) {
    return;
  }

  // https://github.com/davidchambers/Base64.js
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  window.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 === 1) {
      throw new Error('bad atob input');
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      (buffer = input.charAt(idx++));
      // character found in table?
      // initialize bit storage and add its ascii value
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = digits.indexOf(buffer);
    }
    return output;
  };
})();

// Function.prototype.bind?
// Support: Android<4.0, iOS<6.0
(function checkFunctionPrototypeBindCompatibility() {
  if (typeof Function.prototype.bind !== 'undefined') {
    return;
  }

  Function.prototype.bind = function functionPrototypeBind(obj) {
    var fn = this, headArgs = Array.prototype.slice.call(arguments, 1);
    var bound = function functionPrototypeBindBound() {
      var args = headArgs.concat(Array.prototype.slice.call(arguments));
      return fn.apply(obj, args);
    };
    return bound;
  };
})();

// HTMLElement dataset property
// Support: IE<11, Safari<5.1, Android<4.0
(function checkDatasetProperty() {
  var div = document.createElement('div');
  if ('dataset' in div) {
    return; // dataset property exists
  }

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function() {
      var this$1 = this;

      if (this._dataset) {
        return this._dataset;
      }

      var dataset = {};
      for (var j = 0, jj = this.attributes.length; j < jj; j++) {
        var attribute = this$1.attributes[j];
        if (attribute.name.substring(0, 5) !== 'data-') {
          continue;
        }
        var key = attribute.name.substring(5).replace(/\-([a-z])/g,
          function(all, ch) {
            return ch.toUpperCase();
          });
        dataset[key] = attribute.value;
      }

      Object.defineProperty(this, '_dataset', {
        value: dataset,
        writable: false,
        enumerable: false
      });
      return dataset;
    },
    enumerable: true
  });
})();

// HTMLElement classList property
// Support: IE<10, Android<4.0, iOS<5.0
(function checkClassListProperty() {
  var div = document.createElement('div');
  if ('classList' in div) {
    return; // classList property exists
  }

  function changeList(element, itemName, add, remove) {
    var s = element.className || '';
    var list = s.split(/\s+/g);
    if (list[0] === '') {
      list.shift();
    }
    var index = list.indexOf(itemName);
    if (index < 0 && add) {
      list.push(itemName);
    }
    if (index >= 0 && remove) {
      list.splice(index, 1);
    }
    element.className = list.join(' ');
    return (index >= 0);
  }

  var classListPrototype = {
    add: function(name) {
      changeList(this.element, name, true, false);
    },
    contains: function(name) {
      return changeList(this.element, name, false, false);
    },
    remove: function(name) {
      changeList(this.element, name, false, true);
    },
    toggle: function(name) {
      changeList(this.element, name, true, true);
    }
  };

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      if (this._classList) {
        return this._classList;
      }

      var classList = Object.create(classListPrototype, {
        element: {
          value: this,
          writable: false,
          enumerable: true
        }
      });
      Object.defineProperty(this, '_classList', {
        value: classList,
        writable: false,
        enumerable: false
      });
      return classList;
    },
    enumerable: true
  });
})();

// Check console compatibility
// In older IE versions the console object is not available
// unless console is open.
// Support: IE<10
(function checkConsoleCompatibility() {
  if (!('console' in window)) {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {}
    };
  } else if (!('bind' in console.log)) {
    // native functions in IE9 might not have bind
    console.log = (function(fn) {
      return function(msg) {
        return fn(msg);
      };
    })(console.log);
    console.error = (function(fn) {
      return function(msg) {
        return fn(msg);
      };
    })(console.error);
    console.warn = (function(fn) {
      return function(msg) {
        return fn(msg);
      };
    })(console.warn);
  }
})();

// Check onclick compatibility in Opera
// Support: Opera<15
(function checkOnClickCompatibility() {
  // workaround for reported Opera bug DSK-354448:
  // onclick fires on disabled buttons with opaque content
  function ignoreIfTargetDisabled(event) {
    if (isDisabled(event.target)) {
      event.stopPropagation();
    }
  }
  function isDisabled(node) {
    return node.disabled || (node.parentNode && isDisabled(node.parentNode));
  }
  if (isOpera) {
    // use browser detection since we cannot feature-check this bug
    document.addEventListener('click', ignoreIfTargetDisabled, true);
  }
})();

// Checks if possible to use URL.createObjectURL()
// Support: IE
(function checkOnBlobSupport() {
  // sometimes IE loosing the data created with createObjectURL(), see #3977
  if (isIE) {
    RTYCompatibilityWrapper.disableCreateObjectURL = true;
  }
})();

// Checks if navigator.language is supported
(function checkNavigatorLanguage() {
  if ('language' in navigator) {
    return;
  }
  RTYCompatibilityWrapper.locale = navigator.userLanguage || 'en-US';
})();

// Support: Safari 6.0+, Android<3.0, Chrome 39/40, iOS
(function checkRangeRequests() {
  // Safari has issues with cached range requests see:
  // https://github.com/mozilla/pdf.js/issues/3260
  // Last tested with version 6.0.4.

  // Older versions of Android (pre 3.0) has issues with range requests, see:
  // https://github.com/mozilla/pdf.js/issues/3381.
  // Make sure that we only match webkit-based Android browsers,
  // since Firefox/Fennec works as expected.

  // Range requests are broken in Chrome 39 and 40, https://crbug.com/442318
  if (isSafari || isAndroidPre3 || isChromeWithRangeBug || isIOS) {
    RTYCompatibilityWrapper.disableRange = true;
    RTYCompatibilityWrapper.disableStream = true;
  }
})();

// Check if the browser supports manipulation of the history.
// Support: IE<10, Android<4.2
(function checkHistoryManipulation() {
  // Android 2.x has so buggy pushState support that it was removed in
  // Android 3.0 and restored as late as in Android 4.2.
  // Support: Android 2.x
  if (!history.pushState || isAndroidPre3) {
    RTYCompatibilityWrapper.disableHistory = true;
  }
})();

// Support: IE<11, Chrome<21, Android<4.4, Safari<6
(function checkSetPresenceInImageData() {
  // IE < 11 will use window.CanvasPixelArray which lacks set function.
  if (window.CanvasPixelArray) {
    if (typeof window.CanvasPixelArray.prototype.set !== 'function') {
      window.CanvasPixelArray.prototype.set = function(arr) {
        var this$1 = this;

        for (var i = 0, ii = this.length; i < ii; i++) {
          this$1[i] = arr[i];
        }
      };
    }
  } else {
    // Old Chrome and Android use an inaccessible CanvasPixelArray prototype.
    // Because we cannot feature detect it, we rely on user agent parsing.
    var polyfill = false, versionMatch;
    if (isChrome) {
      versionMatch = userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      // Chrome < 21 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[2]) < 21;
    } else if (isAndroid) {
      // Android < 4.4 lacks the set function.
      // Android >= 4.4 will contain Chrome in the user agent,
      // thus pass the Chrome check above and not reach this block.
      polyfill = isAndroidPre5;
    } else if (isSafari) {
      versionMatch = userAgent.
        match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//);
      // Safari < 6 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[1]) < 6;
    }

    if (polyfill) {
      var contextPrototype = window.CanvasRenderingContext2D.prototype;
      var createImageData = contextPrototype.createImageData;
      contextPrototype.createImageData = function(w, h) {
        var imageData = createImageData.call(this, w, h);
        imageData.data.set = function(arr) {
          var this$1 = this;

          for (var i = 0, ii = this.length; i < ii; i++) {
            this$1[i] = arr[i];
          }
        };
        return imageData;
      };
      // this closure will be kept referenced, so clear its vars
      contextPrototype = null;
    }
  }
})();

// Support: IE<10, Android<4.0, iOS
(function checkRequestAnimationFrame() {
  function fakeRequestAnimationFrame(callback) {
    window.setTimeout(callback, 20);
  }

  if (isIOS) {
    // requestAnimationFrame on iOS is broken, replacing with fake one.
    window.requestAnimationFrame = fakeRequestAnimationFrame;
    return;
  }
  if ('requestAnimationFrame' in window) {
    return;
  }
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    fakeRequestAnimationFrame;
})();

// Support: Android, iOS
(function checkCanvasSizeLimitation() {
  if (isIOS || isAndroid) {
    // 5MP
    RTYCompatibilityWrapper.maxCanvasPixels = 5242880;
  }
})();

// Disable fullscreen support for certain problematic configurations.
// Support: IE11+ (when embedded).
(function checkFullscreenSupport() {
  if (isIE && window.parent !== window) {
    RTYCompatibilityWrapper.disableFullscreen = true;
  }
})();

// Provides document.currentScript support
// Support: IE, Chrome<29.
(function checkCurrentScript() {
  if ('currentScript' in document) {
    return;
  }
  Object.defineProperty(document, 'currentScript', {
    get: function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    },
    enumerable: true,
    configurable: true
  });
})();

// Provides `input.type = 'type'` runtime failure protection.
// Support: IE9,10.
(function checkInputTypeNumberAssign() {
  var el = document.createElement('input');
  try {
    el.type = 'number';
  } catch (ex) {
    var inputProto = el.constructor.prototype;
    var typeProperty = Object.getOwnPropertyDescriptor(inputProto, 'type');
    Object.defineProperty(inputProto, 'type', {
      get: function () {
        return typeProperty.get.call(this);
      },
      set: function (value) {
        typeProperty.set.call(this, value === 'number' ? 'text' : value);
      },
      enumerable: true,
      configurable: true
    });
  }
})();

// Provides correct document.readyState value for legacy browsers.
// Support: IE9,10.
(function checkDocumentReadyState() {
  if (!document.attachEvent) {
    return;
  }
  var documentProto = document.constructor.prototype;
  var readyStateProto = Object.getOwnPropertyDescriptor(documentProto,
                                                        'readyState');
  Object.defineProperty(documentProto, 'readyState', {
    get: function () {
      var value = readyStateProto.get.call(this);
      return value === 'interactive' ? 'loading' : value;
    },
    set: function (value) {
      readyStateProto.set.call(this, value);
    },
    enumerable: true,
    configurable: true
  });
})();

}).call(window);

/// Polyfill
(function checkArrayPolyFill(){
  if (!Array.from) {
      Array.from = (function () {
          var toStr = Object.prototype.toString;
          var isCallable = function (fn) {
              return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
          };
          var toInteger = function (value) {
              var number = Number(value);
              if (isNaN(number)) {
                  return 0;
              }
              if (number === 0 || !isFinite(number)) {
                  return number;
              }
              return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
          };
          var maxSafeInteger = Math.pow(2, 53) - 1;
          var toLength = function (value) {
              var len = toInteger(value);
              return Math.min(Math.max(len, 0), maxSafeInteger);
          };

          // The length property of the from method is 1.
          return function from(arrayLike /*, mapFn, thisArg */) {
              // 1. Let C be the this value.
              var C = this;

              // 2. Let items be ToObject(arrayLike).
              var items = Object(arrayLike);

              // 3. ReturnIfAbrupt(items).
              if (arrayLike == null) {
                  throw new TypeError(
                      "Array.from requires an array-like object - not null or undefined"
                  );
              }

              // 4. If mapfn is undefined, then let mapping be false.
              var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
              var T;
              if (typeof mapFn !== 'undefined') {
                  // 5. else
                  // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                  if (!isCallable(mapFn)) {
                      throw new TypeError(
                          'Array.from: when provided, the second argument must be a function'
                      );
                  }

                  // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                  if (arguments.length > 2) {
                      T = arguments[2];
                  }
              }

              // 10. Let lenValue be Get(items, "length").
              // 11. Let len be ToLength(lenValue).
              var len = toLength(items.length);

              // 13. If IsConstructor(C) is true, then
              // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
              // 14. a. Else, Let A be ArrayCreate(len).
              var A = isCallable(C) ? Object(new C(len)) : new Array(len);

              // 16. Let k be 0.
              var k = 0;
              // 17. Repeat, while k < len… (also steps a - h)
              var kValue;
              while (k < len) {
                  kValue = items[k];
                  if (mapFn) {
                      A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T,
                          kValue, k);
                  } else {
                      A[k] = kValue;
                  }
                  k += 1;
              }
              // 18. Let putStatus be Put(A, "length", len, true).
              A.length = len;
              // 20. Return A.
              return A;
          };
      }());
  }

  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    };
  }
})();


var compatibilityWrapper = {};

/**
 * Google Lang maps
 */
var uu$$3 = {
  googleLangIDMaps: {
    'af': {
      englishName: 'Afrikaans',
      localName: 'Afrikaans',
      zhName: '南非荷兰语',
      compatible: ['af', 'af-AF', 'af_af'],
      compatibleForKendoUI: {
        culture: 'af',
        message: ''
      }
    },
    'sq': {
      englishName: 'Albanian',
      localName: 'Shqiptar',
      zhName: '阿尔巴尼亚语',
      compatible: ['sq', 'sq-SQ', 'sq_sq'],
      compatibleForKendoUI: {
        culture: 'sq',
        message: ''
      }
    },
    'ar': {
      englishName: 'Arabic',
      localName: 'العربية',
      zhName: '阿拉伯语',
      compatible: ['ar', 'ar-AR', 'ar_ar'],
      compatibleForKendoUI: {
        culture: 'ar',
        message: ''
      }
    },
    'hy': {
      englishName: 'Armenian',
      localName: 'Հայերեն',
      zhName: '亚美尼亚语',
      compatible: ['hy', 'hy-HY', 'hy_HY'],
      compatibleForKendoUI: {
        culture: 'hy',
        message: 'hy-AM'
      }
    },
    'az': {
      englishName: 'Azerbaijani',
      localName: 'Azərbaycan',
      zhName: '阿塞拜疆语',
      compatible: ['az', 'az-AZ', 'az_AZ'],
      compatibleForKendoUI: {
        culture: 'az',
        message: ''
      }
    },
    'eu': {
      englishName: 'Basque',
      localName: 'Euskal',
      zhName: '巴斯克语',
      compatible: ['eu', 'eu-EU', 'en_EU'],
      compatibleForKendoUI: {
        culture: 'eu',
        message: ''
      }
    },
    'be': {
      englishName: 'Belarusian',
      localName: 'Беларуская',
      zhName: '白俄罗斯语',
      compatible: ['be', 'be-BE', 'be_BE'],
      compatibleForKendoUI: {
        culture: 'be',
        message: ''
      }
    },
    'bn': {
      englishName: 'Bengali',
      localName: 'বাঙ্গালী',
      zhName: '孟加拉语',
      compatible: ['bn', 'bn-BN', 'bn_BN'],
      compatibleForKendoUI: {
        culture: 'bn',
        message: ''
      }
    },
    'bs': {
      englishName: 'Bosnian',
      localName: 'Bosanski',
      zhName: '波斯尼亚语',
      compatible: ['bs', 'bs-BS', 'bs_BS'],
      compatibleForKendoUI: {
        culture: 'bs',
        message: ''
      }
    },
    'bg': {
      englishName: 'Bulgarian',
      localName: 'Български',
      zhName: '保加利亚语',
      compatible: ['bg', 'bg-BG', 'bg_BG'],
      compatibleForKendoUI: {
        culture: 'bg',
        message: 'bg-BG'
      }
    },
    'ca': {
      englishName: 'Catalan',
      localName: 'Català',
      zhName: '加泰罗尼亚语',
      compatible: ['ca', 'ca-ES', 'ca-es'],
      compatibleForKendoUI: {
        culture: 'ca',
        message: ''
      }
    },
    'ceb': {
      englishName: 'Cebuano',
      localName: 'Cebuano',
      zhName: '宿雾语',
      compatible: ['ceb'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'ny': {
      englishName: 'Chichewa',
      localName: 'Chichewa',
      zhName: '奇切瓦语',
      compatible: ['ny', 'ny-NY', 'ny_NY'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'zh-CN': {
      englishName: 'Chinese Simplified',
      localName: '简体中文',
      zhName: '中文简体',
      compatible: ['zh', 'zh-CN', 'zh_cn', 'zh-Hans'],
      compatibleForKendoUI: {
        culture: 'zh-CN',
        message: 'zh-CN'
      }
    },
    'zh-TW': {
      englishName: 'Chinese Traditional',
      localName: '繁体中文',
      zhName: '中文繁体',
      compatible: ['zh-TW', 'zh_tw', 'zh-Hant'],
      compatibleForKendoUI: {
        culture: 'zh-TW',
        message: 'zh-TW'
      }
    },
    'hr': {
      englishName: 'Croatian',
      localName: 'Hrvatski',
      zhName: '克罗地亚语',
      compatible: ['hr', 'hr-HR', 'hr_hr'],
      compatibleForKendoUI: {
        culture: 'hr',
        message: ''
      }
    },
    'cs': {
      englishName: 'Czech',
      localName: 'Čeština',
      zhName: '捷克语',
      compatible: ['cs', 'cs-CZ', 'cs_cz'],
      compatibleForKendoUI: {
        culture: 'cs',
        message: 'cs-CZ'
      }
    },
    'da': {
      englishName: 'Danish',
      localName: 'Dansk',
      zhName: '丹麦语',
      compatible: ['da', 'da-DK', 'da-da', 'da_da'],
      compatibleForKendoUI: {
        culture: 'da',
        message: 'da-DK'
      }
    },
    'nl': {
      englishName: 'Dutch',
      localName: 'Nederlands',
      zhName: '荷兰语',
      compatible: ['nl', 'nl-NL', 'nl_nl'],
      compatibleForKendoUI: {
        culture: 'nl',
        message: 'nl-NL'
      }
    },
    'en': {
      englishName: 'English',
      localName: 'English',
      zhName: '英语',
      compatible: ['en', 'en-US', 'en_us'],
      compatibleForKendoUI: {
        culture: 'en-US',
        message: 'en-US'
      }
    },
    'eo': {
      englishName: 'Esperanto',
      localName: 'Esperanto',
      zhName: '世界语',
      compatible: ['eo', 'eo-EO', 'eo_eo'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'et': {
      englishName: 'Estonian',
      localName: 'Eesti',
      zhName: '爱沙尼亚语',
      compatible: ['et', 'et-ET', 'et_ET'],
      compatibleForKendoUI: {
        culture: 'et',
        message: ''
      }
    },
    'tl': {
      englishName: 'Filipino',
      localName: 'Pilipino',
      zhName: '菲律宾语',
      compatible: ['tl', 'tl-TL', 'tl_TL'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'fi': {
      englishName: 'Finnish',
      localName: 'Suomi',
      zhName: '芬兰语',
      compatible: ['fi', 'fi-FI', 'fi_fi'],
      compatibleForKendoUI: {
        culture: 'fi',
        message: 'fi-FI'
      }
    },
    'fr': {
      englishName: 'French',
      localName: 'Français',
      zhName: '法语',
      compatible: ['fr', 'fr-FR', 'fr_fr'],
      compatibleForKendoUI: {
        culture: 'fr',
        message: 'fr-FR'
      }
    },
    'gl': {
      englishName: 'Galician',
      localName: 'Galega',
      zhName: '加利西亚语',
      compatible: ['gl', 'gl-GL', 'gl_GL'],
      compatibleForKendoUI: {
        culture: 'gl',
        message: ''
      }
    },
    'ka': {
      englishName: 'Georgian',
      localName: 'ქართული',
      zhName: '格鲁吉亚语',
      compatible: ['ka', 'ka-kA', 'ka_ka'],
      compatibleForKendoUI: {
        culture: 'ka',
        message: ''
      }
    },
    'de': {
      englishName: 'German',
      localName: 'Deutsch',
      zhName: '德语',
      compatible: ['de', 'de-DE', 'de_de'],
      compatibleForKendoUI: {
        culture: 'de',
        message: 'de-DE'
      }
    },
    'el': {
      englishName: 'Greek',
      localName: 'Ελληνικά',
      zhName: '希腊语',
      compatible: ['el', 'el-GR', 'el_gr'],
      compatibleForKendoUI: {
        culture: 'el',
        message: ''
      }
    },
    'gu': {
      englishName: 'Gujarati',
      localName: 'ગુજરાતી',
      zhName: '古吉拉特语',
      compatible: ['gu', 'gu-GU', 'gu_gu'],
      compatibleForKendoUI: {
        culture: 'gu',
        message: ''
      }
    },
    'ht': {
      englishName: 'Haitian Creole',
      localName: 'Kreyòl ayisyen',
      zhName: '海地克里奥尔语',
      compatible: ['ht', 'ht-HT', 'ht_ht'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'ha': {
      englishName: 'Hausa',
      localName: 'Hausa',
      zhName: '豪萨语',
      compatible: ['ha', 'ha-HA', 'ha_ha'],
      compatibleForKendoUI: {
        culture: 'ha',
        message: ''
      }
    },
    'iw': {
      englishName: 'Hebrew',
      localName: 'עברית',
      zhName: '希伯来语',
      compatible: ['iw', 'iw-IW', 'iw_iw', 'he', 'he-IL', 'he-il'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'hi': {
      englishName: 'Hindi',
      localName: 'हिन्दी',
      zhName: '印地语',
      compatible: ['hi', 'hi-HI', 'hi_hi'],
      compatibleForKendoUI: {
        culture: 'hi',
        message: ''
      }
    },
    'hmn': {
      englishName: 'Hmong',
      localName: 'Hmoob',
      zhName: '苗族语',
      compatible: ['hmn'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'hu': {
      englishName: 'Hungarian',
      localName: 'Magyar',
      zhName: '匈牙利语',
      compatible: ['hu', 'hu-HU', 'hu_hu'],
      compatibleForKendoUI: {
        culture: 'hu',
        message: ''
      }
    },
    'is': {
      englishName: 'Icelandic',
      localName: 'Icelandic',
      zhName: '冰岛语',
      compatible: ['is', 'is-IS', 'is_is'],
      compatibleForKendoUI: {
        culture: 'is',
        message: ''
      }
    },
    'ig': {
      englishName: 'Igbo',
      localName: 'Igbo',
      zhName: '伊博语',
      compatible: ['ig', 'ig-IG', 'ig_ig'],
      compatibleForKendoUI: {
        culture: 'ig',
        message: ''
      }
    },
    'id': {
      englishName: 'Indonesian',
      localName: 'Indonesia',
      zhName: '印尼语',
      compatible: ['id', 'id-ID', 'id_id'],
      compatibleForKendoUI: {
        culture: 'id',
        message: ''
      }
    },
    'ga': {
      englishName: 'Irish',
      localName: 'Gaeilge',
      zhName: '爱尔兰语',
      compatible: ['ga', 'ga-GA', 'ga_ga'],
      compatibleForKendoUI: {
        culture: 'ga',
        message: ''
      }
    },
    'it': {
      englishName: 'Italian',
      localName: 'Italiano',
      zhName: '意大利语',
      compatible: ['it', 'it-IT', 'it_it'],
      compatibleForKendoUI: {
        culture: 'it',
        message: 'it-IT'
      }
    },
    'ja': {
      englishName: 'Japanese',
      localName: '日本の',
      zhName: '日语',
      compatible: ['ja', 'ja-JP', 'ja_jp'],
      compatibleForKendoUI: {
        culture: 'ja-JP',
        message: 'ja-JP'
      }
    },
    'jw': {
      englishName: 'Javanese',
      localName: 'Jawa',
      zhName: '爪哇语',
      compatible: ['jw', 'jw-JW', 'jw_jw'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'kn': {
      englishName: 'Kannada',
      localName: 'ಕನ್ನಡ',
      zhName: '卡纳达语',
      compatible: ['kn', 'kn-KN', 'kn_kn'],
      compatibleForKendoUI: {
        culture: 'kn',
        message: ''
      }
    },
    'kk': {
      englishName: 'Kazakh',
      localName: 'Қазақ',
      zhName: '哈萨克语',
      compatible: ['kk', 'kk-KK', 'kk_kk'],
      compatibleForKendoUI: {
        culture: 'kk',
        message: ''
      }
    },
    'km': {
      englishName: 'Khmer',
      localName: 'ខ្មែរ',
      zhName: '高棉语',
      compatible: ['km', 'km-KM', 'km_km'],
      compatibleForKendoUI: {
        culture: 'km',
        message: ''
      }
    },
    'ko': {
      englishName: 'Korean',
      localName: '한국의',
      zhName: '韩语',
      compatible: ['ko', 'ko-KR', 'ko_kr'],
      compatibleForKendoUI: {
        culture: 'ko',
        message: ''
      }
    },
    'lo': {
      englishName: 'Lao',
      localName: 'ລາວ',
      zhName: '老挝语',
      compatible: ['lo', 'lo-LO', 'lo_lo'],
      compatibleForKendoUI: {
        culture: 'lo',
        message: ''
      }
    },
    'la': {
      englishName: 'Latin',
      localName: 'Latine',
      zhName: '拉丁语',
      compatible: ['la', 'la-LA', 'la_la'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'lv': {
      englishName: 'Latvian',
      localName: 'Latvijas',
      zhName: '拉脱维亚语',
      compatible: ['lv', 'lv-LV', 'lv_lv'],
      compatibleForKendoUI: {
        culture: 'lv',
        message: ''
      }
    },
    'lt': {
      englishName: 'Lithuanian',
      localName: 'Lietuvos',
      zhName: '立陶宛语',
      compatible: ['lt', 'lt-LT', 'lt_lt'],
      compatibleForKendoUI: {
        culture: 'lt',
        message: ''
      }
    },
    'mk': {
      englishName: 'Macedonian',
      localName: 'Македонски',
      zhName: '马其顿语',
      compatible: ['mk', 'mk-MK', 'mk_mk'],
      compatibleForKendoUI: {
        culture: 'mk',
        message: ''
      }
    },
    'mg': {
      englishName: 'Malagasy',
      localName: 'Malagasy',
      zhName: '马尔加什语',
      compatible: ['mg', 'mg-MG', 'mg_mg'],
      compatibleForKendoUI: {
        culture: 'mg',
        message: ''
      }
    },
    'ms': {
      englishName: 'Malay',
      localName: 'Melayu',
      zhName: '马来西亚语',
      compatible: ['ms', 'ms-MS', 'ms_ms'],
      compatibleForKendoUI: {
        culture: 'ms',
        message: ''
      }
    },
    'ml': {
      englishName: 'Malayalam',
      localName: 'മലയാളം',
      zhName: '马拉雅拉姆语',
      compatible: ['ml', 'ml-ML', 'ml_ml'],
      compatibleForKendoUI: {
        culture: 'ml',
        message: ''
      }
    },
    'mt': {
      englishName: 'Maltese',
      localName: 'Malti',
      zhName: '马耳他语',
      compatible: ['mt', 'mt-MT', 'mt_mt'],
      compatibleForKendoUI: {
        culture: 'mt',
        message: ''
      }
    },
    'mi': {
      englishName: 'Maori',
      localName: 'Maori',
      zhName: '毛利语',
      compatible: ['mi', 'mi-MI', 'mi_mi'],
      compatibleForKendoUI: {
        culture: 'mi',
        message: ''
      }
    },
    'mr': {
      englishName: 'Marathi',
      localName: 'मराठी',
      zhName: '马拉语',
      compatible: ['mr', 'mr-MR', 'mr_mr', 'mr-IN'],
      compatibleForKendoUI: {
        culture: 'mr',
        message: ''
      }
    },
    'mn': {
      englishName: 'Mongolian',
      localName: 'Монгол',
      zhName: '蒙语',
      compatible: ['mn', 'mn-MN', 'mn_mn'],
      compatibleForKendoUI: {
        culture: 'mn',
        message: ''
      }
    },
    'my': {
      englishName: 'Myanmar (Burmese)',
      localName: 'မြန်မာ (ဗမာ)',
      zhName: '缅甸语',
      compatible: ['my', 'my-MY', 'my_my'],
      compatibleForKendoUI: {
        culture: 'my',
        message: ''
      }
    },
    'ne': {
      englishName: 'Nepali',
      localName: 'नेपाली',
      zhName: '尼泊尔语',
      compatible: ['ne', 'ne-NE', 'ne_ne'],
      compatibleForKendoUI: {
        culture: 'ne',
        message: ''
      }
    },
    'no': {
      englishName: 'Norwegian',
      localName: 'Norsk',
      zhName: '挪威语',
      compatible: ['no', 'no-NO', 'no_no', 'nb', 'nb-NO', 'nb_no'],
      compatibleForKendoUI: {
        culture: 'no',
        message: ''
      }
    },
    'fa': {
      englishName: 'Persian',
      localName: 'فارسی',
      zhName: '波斯语',
      compatible: ['fa', 'fa-FA', 'fa_fa'],
      compatibleForKendoUI: {
        culture: 'fa',
        message: ''
      }
    },
    'pl': {
      englishName: 'Polish',
      localName: 'Polski',
      zhName: '波兰语',
      compatible: ['pl', 'pl-PL', 'pl_pl'],
      compatibleForKendoUI: {
        culture: 'pl',
        message: 'pl-PL'
      }
    },
    'pt': {
      englishName: 'Portuguese',
      localName: 'Português',
      zhName: '葡萄牙语',
      compatible: ['pt', 'pt-BR', 'pt_br', 'pt-PT', 'pt_pt'],
      compatibleForKendoUI: {
        culture: 'pt',
        message: 'pt-PT'
      }
    },
    'ma': {
      englishName: 'Punjabi',
      localName: 'ਪੰਜਾਬੀ ਦੇ',
      zhName: '旁遮普语',
      compatible: ['ma', 'ma-MA', 'ma_ma'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'ro': {
      englishName: 'Romanian',
      localName: 'Român',
      zhName: '罗马尼亚语',
      compatible: ['ro', 'ro-RO', 'ro_ro'],
      compatibleForKendoUI: {
        culture: 'ro',
        message: 'ro-RO'
      }
    },
    'ru': {
      englishName: 'Russian',
      localName: 'Русский',
      zhName: '俄语',
      compatible: ['ru', 'ru-RU', 'ru_ru'],
      compatibleForKendoUI: {
        culture: 'ru',
        message: 'ru-RU'
      }
    },
    'sr': {
      englishName: 'Serbian',
      localName: 'Српски',
      zhName: '塞尔维亚语',
      compatible: ['sr', 'sr-SR', 'sr_sr'],
      compatibleForKendoUI: {
        culture: 'sr',
        message: ''
      }
    },
    'st': {
      englishName: 'Sesotho',
      localName: 'Sesotho',
      zhName: '塞索托语',
      compatible: ['st', 'st-ST', 'st_st'],
      compatibleForKendoUI: {
        culture: 'st',
        message: ''
      }
    },
    'si': {
      englishName: 'Sinhala',
      localName: 'සිංහල',
      zhName: '僧伽罗语',
      compatible: ['si', 'si-SI', 'si_si'],
      compatibleForKendoUI: {
        culture: 'si',
        message: ''
      }
    },
    'sk': {
      englishName: 'Slovak',
      localName: 'Slovenský',
      zhName: '斯洛伐克语',
      compatible: ['sk', 'sk-SK', 'sk_sk'],
      compatibleForKendoUI: {
        culture: 'sk',
        message: 'sk-SK'
      }
    },
    'sl': {
      englishName: 'Slovenian',
      localName: 'Slovenščina',
      zhName: '斯洛文尼亚语',
      compatible: ['sl', 'sl-SL', 'sl_sl'],
      compatibleForKendoUI: {
        culture: 'sl',
        message: ''
      }
    },
    'so': {
      englishName: 'Somali',
      localName: 'Somali',
      zhName: '索马里语',
      compatible: ['so', 'so-SO', 'so_so'],
      compatibleForKendoUI: {
        culture: 'so',
        message: ''
      }
    },
    'es': {
      englishName: 'Spanish',
      localName: 'Español',
      zhName: '西班牙语',
      compatible: ['es', 'es-ES', 'es_es', 'es-MX', 'es-XL', 'es-xl'],
      compatibleForKendoUI: {
        culture: 'es',
        message: 'es-ES'
      }
    },
    'su': {
      englishName: 'Sudanese',
      localName: 'Sudanese',
      zhName: '苏丹语',
      compatible: ['su', 'su-SU', 'su_su'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'sw': {
      englishName: 'Swahili',
      localName: 'Kiswahili',
      zhName: '斯瓦希里语',
      compatible: ['sw', 'sw-SW', 'sw_sw'],
      compatibleForKendoUI: {
        culture: 'sw',
        message: ''
      }
    },
    'sv': {
      englishName: 'Swedish',
      localName: 'Svenska',
      zhName: '瑞典语',
      compatible: ['sv', 'sv-SE', 'sv_se', 'sv-SV', 'sv_sv'],
      compatibleForKendoUI: {
        culture: 'sv',
        message: 'sv-SV'
      }
    },
    'tg': {
      englishName: 'Tajik',
      localName: 'Тоҷикистон',
      zhName: '塔吉克语',
      compatible: ['tg', 'tg-TG', 'tg_tg'],
      compatibleForKendoUI: {
        culture: 'tg',
        message: ''
      }
    },
    'ta': {
      englishName: 'Tamil',
      localName: 'தமிழ்',
      zhName: '泰米尔语',
      compatible: ['ta', 'ta-TA', 'ta_ta'],
      compatibleForKendoUI: {
        culture: 'ta',
        message: ''
      }
    },
    'te': {
      englishName: 'Telugu',
      localName: 'తెలుగు',
      zhName: '泰卢固语',
      compatible: ['te', 'te-TE', 'te_te'],
      compatibleForKendoUI: {
        culture: 'te',
        message: ''
      }
    },
    'th': {
      englishName: 'Thai',
      localName: 'ไทย',
      zhName: '泰语',
      compatible: ['th', 'th-TH', 'th_th'],
      compatibleForKendoUI: {
        culture: 'th',
        message: ''
      }
    },
    'tr': {
      englishName: 'Turkish',
      localName: 'Türk',
      zhName: '土耳其语',
      compatible: ['tr', 'tr-TR', 'tr_tr'],
      compatibleForKendoUI: {
        culture: 'tr',
        message: 'tr-TR'
      }
    },
    'uk': {
      englishName: 'Ukrainian',
      localName: 'Український',
      zhName: '乌克兰语',
      compatible: ['uk', 'uk-UA', 'uk__ua', 'uk-UK', 'uk__uk'],
      compatibleForKendoUI: {
        culture: 'uk',
        message: 'uk-UA'
      }
    },
    'ur': {
      englishName: 'Urdu',
      localName: 'اردو',
      zhName: '乌尔都语',
      compatible: ['ur', 'ur-UR', 'ur__ur'],
      compatibleForKendoUI: {
        culture: 'ur',
        message: ''
      }
    },
    'uz': {
      englishName: 'Uzbek',
      localName: 'O\'zbekiston',
      zhName: '乌兹别克语',
      compatible: ['uz', 'uz-UZ', 'uz__uz'],
      compatibleForKendoUI: {
        culture: 'uz',
        message: ''
      }
    },
    'vi': {
      englishName: 'Vietnamese',
      localName: 'Tiếng Việt',
      zhName: '越南语',
      compatible: ['vi', 'vi-VN', 'vi-vn', 'vi-VI', 'vi_vi'],
      compatibleForKendoUI: {
        culture: 'vi',
        message: ''
      }
    },
    'cy': {
      englishName: 'Welsh',
      localName: 'Cymraeg',
      zhName: '威尔士语',
      compatible: ['cy', 'cy-CY', 'cy_cy'],
      compatibleForKendoUI: {
        culture: 'cy',
        message: ''
      }
    },
    'yi': {
      englishName: 'Yiddish',
      localName: 'ייִדיש',
      zhName: '意第绪语',
      compatible: ['yi', 'yi-YI', 'yi_yi'],
      compatibleForKendoUI: {
        culture: '',
        message: ''
      }
    },
    'yo': {
      englishName: 'Yoruba',
      localName: 'Yoruba',
      zhName: '约鲁巴语',
      compatible: ['yo', 'yo-YO', 'yo_yo'],
      compatibleForKendoUI: {
        culture: 'yo',
        message: ''
      }
    },
    'zu': {
      englishName: 'Zulu',
      localName: 'Zulu',
      zhName: '祖鲁语',
      compatible: ['zu', 'zu-ZU', 'zu_zu'],
      compatibleForKendoUI: {
        culture: 'zu',
        message: ''
      }
    }
  },
  getGoogleLangID: function (langKey) {
    var foundLangID = null;
    var obj = this.googleLangIDMaps;
    var fn = function (value, key) {
      var compatibleList = value['compatible'];
      compatibleList.forEach(function (value, index, compatibleList) {
        if (value.toLowerCase() === langKey.toLowerCase()) {
          foundLangID = key;
          return false
        }
      });
    };

    Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
    return foundLangID
  }
};

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */
function autoForJquery$3 (ref) {
  var t$ = ref;
  try {
    if (window) {
      if (window.jQuery && window.$) {
        window.$.RTYUtils = window.$.extend(window.$.RTYUtils, uu$$3);
        window.$ = window.$.extend(window.$, t$);
      }
    }
  } catch (error) {
    console.warn(error);
  }
}

var googleLangIDMaps = uu$$3;
autoForJquery$3(uu$$3);

/**
 * Google Lang maps
 */

var uu$$4 = {};

uu$$4.loadedLanguage = {
  js: [],
  json: [],

  insert: function (info, ext) {
    var jsonStr = JSON.stringify(info);
    var list = (ext === '.js' ? this.js : this.json);
    var found = false;

    list.forEach(function (value, index, array) {
      if (JSON.stringify(value) === jsonStr) {
        found = true;
        return false
      }
    });

    if (!found) { list.push(info); }
  }
};

uu$$4.loadLanguage = function (languageFilesPath, fileExt, callback, referLang, trySafeMode) {
  if ( trySafeMode === void 0 ) trySafeMode = true;

  var t$ = this;

  // Note: Check jQuery library
  common$1.assert(!common$1.isUndefinedOrNullOrFalse(window.jQuery), 'loadLanguage function require jQuery library');
  var $ = window.jQuery || window.$ || {};

  var referLangList = common$1.param2Array(referLang, ['string']);

  /**
   * [gotoLoadLanguageFile 加载语言文件]
   * @param  {[array]} langsFiles             语言文件列表
   * @param  {[string]} ext                   文件扩展名,只支持两种: .josn 和 .js
   * @param  {[function]} successCallback     成功加载回调
   * @return {[type]}                         null
   */
  function gotoLoadLanguageFile (langsFiles, ext, successCallback) {
    /**
     * [_tryLoad 尝试加载]
     * @param  {[string]} file        [文件路径]
     * @param  {[string]} langKey     [关键KEY]
     * @param  {[string]} ext         [扩展名：只支持两种: .josn 和 .js]
     * @param  {[function]} fnNext     [出错下一步执行函数]
     * @param  {[function]} fnCallback [成功加载回调函数]
     * @return {[type]}             [description]
     */
    function _tryLoad (file, langKey, ext, fnNext, fnCallback) {
      try {
        $.ajax({
          url: file,
          dataType: (ext === '.js' ? 'script' : 'json'),
          success: function (data, status) {
            console.log('[x] ' + status + ' =' + file);
            var obj = {
              data: data,
              status: status,
              info: {
                file: file,
                langKey: langKey,
                langID: googleLangIDMaps.getGoogleLangID(langKey),
                ext: ext
              }
            };

            t$.loadedLanguage.insert(obj.info, ext);
            fnCallback && fnCallback(obj);
          },
          error: function (req, status, err) {
            console.log(err);
            try {
              throw new Error('[x]no found... continue.. = ' + file)
            } catch (error) {
              console.warn(error);
              fnNext && fnNext(fnCallback);
            }
          }
        });
      } catch (error) {
        console.error(error);
        fnNext && fnNext();
      }
    }

    /**
     * [gotoTry 尝试]
     * @param  {[type]}   list     [文件对象列表]
     * @param  {[type]}   ext      [扩展名]
     * @param  {Function} callback [成功回调]
     * @return {[type]}            [description]
     */
    function _gotoTry (list, ext, callback) {
      if (common$1.isArray(list) && list.length > 0) {
        var ele = list[0];
        _tryLoad(ele.path, ele.key, ext, function (cb) {
          var newLangFileList = list.splice(1);
          _gotoTry(newLangFileList, ext, cb);
        }, callback);
      } else {
        console.warn('[x] language list length is 0 or not a array. TYPE=' + common$1.getType(list));
      }
    }

    // Try start
    _gotoTry(langsFiles, ext, successCallback);
  }

  // 加载语言的入口
  var curUserLanguage = null;
  var b$ = null;
  if (!common$1.isUndefinedOrNullOrFalse(window.BS)) {
    if (!common$1.isUndefinedOrNullOrFalse(window.BS.b$)) {
      b$ = window.BS.b$;
      if (!common$1.isUndefinedOrNullOrFalse(b$.App)) {
        curUserLanguage = b$.App.getUserLanguage();
      }
    }
  }

  curUserLanguage = curUserLanguage || window.navigator.language || window.navigator.browserLanguage;

  var defaultLangKeys = [];

  // 是否尝试安全模式
  if (trySafeMode) {
    var _safeList = [
      'en-US',
      'en-US'.toLowerCase(),
      'en_US',
      'en_US'.toLowerCase(),
      'en'
    ];

    // 检测当前语言标识是否有兼容的Google语言ID
    var langID = googleLangIDMaps.getGoogleLangID(curUserLanguage);
    if (langID) { defaultLangKeys.push(langID); }

    // 检测当前语言是否在SafeList中
    if (_safeList.findIndex(function (value, index, err) {
      return value === curUserLanguage.toLowerCase()
    }) > -1) {
      defaultLangKeys = defaultLangKeys.concat(_safeList);
    } else {
      // 不是英语, 需要优化来处理
      defaultLangKeys = defaultLangKeys.concat([
        curUserLanguage,
        curUserLanguage.toLowerCase()
      ]);

      // 如果是："zh-CN"
      if (curUserLanguage.split('-').length >= 2) {
        defaultLangKeys = defaultLangKeys.concat([
          curUserLanguage.split('-')[0],
          curUserLanguage.split('-')[0].toLowerCase()
        ]);
      }

      // 如果是："zh_CN"
      if (curUserLanguage.split('_').length >= 2) {
        defaultLangKeys = defaultLangKeys.concat([
          curUserLanguage.split('_')[0],
          curUserLanguage.split('_')[0].toLowerCase()
        ]);
      }

      defaultLangKeys = defaultLangKeys.concat(_safeList);
    }

    // 将指定的处理放到最前面进行处理
    defaultLangKeys = referLangList.concat(defaultLangKeys);
    // 开始解析处理
    var tryLangFileList = [];
    console.log('tryLangFileList = \n');
    defaultLangKeys.forEach(function (value, index, array) {
      tryLangFileList.push({
        key: value,
        path: languageFilesPath + value + fileExt
      });
      console.log(value);
    });

    // start load language ....
    gotoLoadLanguageFile(tryLangFileList, fileExt, callback);
  }
};

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery$4 (ref) {
  var t$ = ref;
  if (window) {
    if (window.jQuery && window.$) {
      window.$ = window.$.extend(window.$, t$);
    }
  }
}

var loadLanguage = uu$$4;
autoForJquery$4(uu$$4);

var uu$$6 = {};

uu$$6.RTYWebHelper = {
  ua: function () {
    return navigator.userAgent.toLowerCase()
  },
  isOpera: function () {
    var t$ = this;
    var ua = t$.ua();
    return ua.indexOf('opera') > -1
  },
  isChrome: function () {
    var t$ = this;
    var ua = t$.ua();
    return ua.indexOf('chrome') > -1
  },
  isSafari: function () {
    var t$ = this;
    var ua = t$.ua();
    var isChrome = t$.isChrome();
    return !isChrome && (/webkit|khtml/).test(ua)
  },
  isSafari3: function () {
    var t$ = this;
    var ua = t$.ua();
    var isSafari = t$.isSafari();
    return isSafari && ua.indexOf('webkit/5') !== -1
  },
  isSafariExtend: function (version) {
    var t$ = this;
    var ua = t$.ua();
    var isSafari = t$.isSafari();

    /** 各版本对照关系
     * 可以通过 http://www.51.la/report/3_Client.asp?t=soft&id=2812271 获取现在机器的配置
     * AppleWebKit 602.4.6,Safari 10.0
     * AppleWebKit 602.3.12,Safari 10.0
     * AppleWebKit 602.1.50,Safari 10.0
     * AppleWebKit/601.6.17    MacOSX 10.11.5
     * AppleWebKit 601.5.17
     * AppleWebKit 601.1.46,Safari 9.0
     * AppleWebKit/600.8.9     MacSOX 10.10.5
     * AppleWebKit 600.1.4,Safari 8.0

      * AppleWebKit/537.75.14   MacSOX 10.9.3
      * AppleWebKit/537.71      MacOSX 10.9
      * AppleWebKit 537.36,Safari 4.0
      * AppleWebKit/534.57      ==================== Windows机器上测试环境, Safari Windows最高版本
      * AppleWebKit/534.55      MacSOX 10.7.3
      * AppleWebKit/534.46
      * AppleWebKit 534.34
      * AppleWebKit/537.13      MacSOX 10.6.8
      * AppleWebKit 534.30,Safari 4.0
      * AppleWebKit/534.15      MacSOX 10.6.5
      * AppleWebKit 533.1,Safari 4.0
      */
    return isSafari && ua.indexOf('webkit/' + version) !== -1 // Mac 10.10.5
  },
  isMacOS: function () {
    var nav = navigator;
    try {
      var oscpu = nav['oscpu']; // for firefox developer editon version
      if (oscpu) {
        var lowCaseOSCPU = oscpu.toLowerCase();
        return lowCaseOSCPU.indexOf('mac') !== -1
      }
    } catch (e) {
      console.error(e);
    }

    return false
  },
  isWinOS: function () {
    var nav = navigator;
    try {
      var oscpu = nav['oscpu']; // for firefox developer editon version
      if (oscpu) {
        var lowCaseOSCPU = oscpu.toLowerCase();
        return lowCaseOSCPU.indexOf('windows') !== -1
      }
    } catch (e) {
      console.error(e);
    }

    return false
  }
};

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery$6 (ref) {
  var t$ = ref;
  if (window) {
    if (window.jQuery && window.$) {
      window.$['RTYWebHelper'] = t$.RTYWebHelper;

      window.$ = window.$.extend(window.$, t$);
    }
  }
}

var webHelper = uu$$6;
autoForJquery$6(uu$$6);

/*globals Sys, Ajax*/

/**
 *  CSS/JS/HTML加载器
 *  @created 2017-2-27 17:13:09
 */

var RTYWebHelper = webHelper.RTYWebHelper;

var uu$$5 = {};

// Creates a gloabl object called templateLoader with a single method "loadExtTemplate"
uu$$5.templateLoader = (function ($, host) {
  // Loads external templates from path and injects in to page DOM
  return {
    cache: [],
    // Method: loadExtTemplate
    // Params: (string) path: the relative path to a file that contains template definition(s)
    loadExtTemplate: function (path, next) {
      var t$ = this;
      // Check Cache
      if ($.inArray(path, t$.cache) > -1) {
        return next && next()
      }

      // Use jQuery Ajax to fetch the template file
      var _templateLoader = $.get(path)
        .success(function (result) {
          if ($.inArray(path, t$.cache) === -1) {
            t$.cache.push(path);
            // On success, Add templates to DOM (assumes file only has template definitions)
            $('body').append(result);
          }
        })
        .error(function (result) {
          alert('Error Loading Templates -- TODO: Better Error Handling');
        });

      _templateLoader.complete(function () {
        // Publish an event that indicates when a template is done loading
        $(host).trigger('TEMPLATE_LOADED', [path]);
        next && next();
      });
    }
  }
})(window.jQuery, document);

uu$$5.templateLoaderAgent = function (templateFileList, successCallBack) {
  var loadedList = [];
  var list = templateFileList;

  var t$ = this;
  list.forEach(function (path, index, array) {
    t$.templateLoader.loadExtTemplate(path, function () {
      if (list.findIndex(function (value, index, err) {
        return value === path
      }) > -1) {
        loadedList.push(path);
        if (loadedList.length === list.length) {
          successCallBack && successCallBack();
        }
      }
    });
  });
};

// 动态加载JS或者CSS通用方式
uu$$5.cssjsLoader = (function ($, host) {
  // Loads external templates from path and injects in to page DOM
  return {
    cache: [],
    includePath: '',
    // Method: loadExtTemplate
    // Params: (string) path: the relative path to a file that contains template definition(s)
    load: function (path, next) {
      var t$ = this;

      var files = typeof path === 'string' ? [path] : path;

      for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s|\s$/g, '');
        var att = name.split('.');
        var ext = att[att.length - 1].toLowerCase();
        var isCSS = ext === 'css';
        var tag = isCSS ? 'link' : 'script';
        var attr = isCSS ? ' type=\'text/css\' rel=\'stylesheet\' ' : ' language=\'javascript\' type=\'text/javascript\' ';
        var link = (isCSS ? 'href' : 'src') + '=\'' + t$.includePath + name + '\'';
        if ($(tag + '[' + link + ']').length === 0) {
          if ($.inArray(path, t$.cache) === -1) {
            t$.cache.push(path);
            var content = '<' + tag + attr + link + '></' + tag + '>';
            isCSS ? $('head').append(content) : $('head').append(content);
          }
        }
      }
      next && next();
    }
  }
})(window.jQuery, document);

var userAgent = navigator.userAgent.toLowerCase();
var $du = {};
var HttpLibrary = $du.HttpLibrary = {
  browser: {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: RTYWebHelper.isSafari(),
    opera: RTYWebHelper.isOpera(),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
  },

  loadedUrls: {},

  isUrlLoaded: function (url) {
    return HttpLibrary.loadedUrls[url] === true
  },
  unregisterUrl: function (url) {
    HttpLibrary.loadedUrls[url] = false;
  },
  registerUrl: function (url) {
    HttpLibrary.loadedUrls[url] = true;
  },

  createScriptTag: function (url, success, error) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'dove-js-' + url.replace(/[\./]+/g, '-'));
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('charset', 'utf-8');
    scriptTag.setAttribute('src', url);

    scriptTag.onload = scriptTag.onreadystatechange = function () {
      if ((!this.readyState ||
          this.readyState === 'loaded' || this.readyState === 'complete')) {
        success();
      }
    };
    scriptTag.onerror = function () {
      error && error(url, url + ' failed to load');
    };

    var toBody = true;
    if (!toBody) {
      var head = HttpLibrary.getHead();
      head.appendChild(scriptTag);
    } else {
      var body = HttpLibrary.getBody();
      body.appendChild(scriptTag);
    }
  },
  getHead: function () {
    return document.getElementsByTagName('head')[0] || document.documentElement
  },
  getBody: function () {
    return document.body
  },
  globalEval: function (data, url, into) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'dove-js-' + url.replace(/[\./]+/g, '-');
    script.charset = 'UTF-8';
    if (HttpLibrary.browser.msie) {
      script.text = data;
    } else {
      script.appendChild(document.createTextNode(data));
    }

    into = into || 'head';
    if (into === 'head') {
      var head = HttpLibrary.getHead();
      head.appendChild(script);
    } else {
      var body = HttpLibrary.getBody();
      body.appendChild(script);
    }
  },
  loadJavascript_jQuery: function (data) {
    if (HttpLibrary.browser.safari) {
      return window.jQuery.ajax({
        type: 'GET',
        url: data.url,
        data: null,
        success: function (content) {
          HttpLibrary.globalEval(content, data.url, 'body');
          data.success();
        },
        error: function (xml, status, e) {
          if (xml && xml.responseText) {
            data.error(xml.responseText);
          } else {
            data.error(data.url + '\n' + e.message);
          }
        },
        dataType: 'html'
      })
    } else {
      HttpLibrary.createScriptTag(data.url, data.success, data.error);
    }
  },
  loadJavascript_MSAJAX: function (data) {
    if (HttpLibrary.browser.safari) {
      var params = {
        url: data.url,
        success: function (content) {
          HttpLibrary.globalEval(content);
          data.success(content);
        },
        error: data.error
      };
      HttpLibrary.httpGet_MSAJAX(params);
    } else {
      HttpLibrary.createScriptTag(data.url, data.success, data.error);
    }
  },
  loadJavascript_Prototype: function (data) {
    if (HttpLibrary.browser.safari) {
      var params = {
        url: data.url,
        success: function (content) {
          HttpLibrary.globalEval(content);
          data.success(content);
        },
        error: data.error
      };
      HttpLibrary.httpGet_Prototype(params);
    } else {
      HttpLibrary.createScriptTag(data.url, data.success, data.error);
    }
  },
  httpGet_jQuery: function (data) {
    return window.jQuery.ajax({
      type: 'GET',
      url: data.url,
      data: null,
      success: data.success,
      error: function (xml, status, e) {
        if (xml && xml.responseText) {
          data.error(xml.responseText);
        } else {
          data.error('Error occured while loading: ' + data.url + '\n' + e.message);
        }
      },
      dataType: data.type || 'html'
    })
  },
  httpGet_MSAJAX: function (data) {
    var _wRequest = new Sys.Net.WebRequest();
    _wRequest.set_url(data.url);
    _wRequest.set_httpVerb('GET');
    _wRequest.add_completed(function (result) {
      var errorMsg = 'Failed to load:' + data.url;
      if (result.get_timedOut()) {
        errorMsg = 'Timed out';
      }
      if (result.get_aborted()) {
        errorMsg = 'Aborted';
      }

      if (result.get_responseAvailable()) { data.success(result.get_responseData()); }
      else { data.error(errorMsg); }
    });

    var executor = new Sys.Net.XMLHttpExecutor();
    _wRequest.set_executor(executor);
    executor.executeRequest();
  },
  httpGet_Prototype: function (data) {
    new Ajax.Request(data.url, {
      method: 'get',
      evalJS: false, // Make sure prototype does not automatically evan scripts
      onSuccess: function (transport, json) {
        data.success(transport.responseText || '');
      },
      onFailure: data.error
    });
  }
};
$du.EnsureExecutor = function (data, callback, failCall, scope) {
  this.data = this.clone(data);
  this.callback = (typeof scope === 'undefined' || scope === null ? callback : this.delegate(callback, scope));
  this.failCall = (typeof scope === 'undefined' || scope === null ? failCall : this.delegate(failCall, scope));
  this.loadStack = [];

  if (data.js && data.js.constructor !== Array) { this.data.js = [data.js]; }
  if (data.html && data.html.constructor !== Array) { this.data.html = [data.html]; }
  if (data.css && data.css.constructor !== Array) { this.data.css = [data.css]; }

  if (typeof data.js === 'undefined') { this.data.js = []; }
  if (typeof data.html === 'undefined') { this.data.html = []; }
  if (typeof data.css === 'undefined') { this.data.css = []; }

  this.init();
  this.load();
};
$du.EnsureExecutor.prototype = {
  init: function () {
    // Fetch Javascript using Framework specific library
    if (typeof jQuery !== 'undefined') {
      this.getJS = HttpLibrary.loadJavascript_jQuery;
      this.httpGet = HttpLibrary.httpGet_jQuery;
    } else if (typeof Prototype !== 'undefined') {
      this.getJS = HttpLibrary.loadJavascript_Prototype;
      this.httpGet = HttpLibrary.httpGet_Prototype;
    } else if (typeof Sys !== 'undefined') {
      this.getJS = HttpLibrary.loadJavascript_MSAJAX;
      this.httpGet = HttpLibrary.httpGet_MSAJAX;
    } else {
      throw new Error('jQuery, Prototype or MS AJAX framework not found')
    }
  },
  getJS: function (data) {
    // abstract function to get Javascript and execute it
  },
  httpGet: function (url, callback) {
    // abstract function to make HTTP GET call
  },
  load: function () {
    var fnc_fail = function (urlList) {
      this.failcall && this.failcall(urlList);
    };

    this.loadJavascripts(
      this.delegate(function () {
        this.loadCSS(this.delegate(function () {
          this.loadHtml(this.delegate(function () {
            this.callback && this.callback();
          }), this.delegate(fnc_fail));
        }), this.delegate(fnc_fail));
      }), this.delegate(fnc_fail));
  },
  loadJavascripts: function (complete, fail) {
    var scriptsToLoad = this.data.js.length;
    if (scriptsToLoad === 0) { return complete() }

    var hasError = false;
    var hasErrorJsList = [];
    this.forEach(this.data.js, function (href) {
      if (HttpLibrary.isUrlLoaded(href) || this.isTagLoaded('script', 'src', href)) {
        scriptsToLoad--;
      } else {
        this.getJS({
          url: href,
          success: this.delegate(function (content) {
            scriptsToLoad--;
            HttpLibrary.registerUrl(href);
          }),
          error: this.delegate(function (msg) {
            scriptsToLoad--;
            if (typeof this.data.error === 'function') {
              this.data.error(href, msg);
            }

            console.log('[Error] loadJavascripts: ' + href + ' \t[Meesage]: ' + msg);
            hasErrorJsList.push(href);
            hasError = true;
          })
        });
      }
    });

    // wait until all the external scripts are downloaded
    this.until({
      test: function () {
        return scriptsToLoad === 0
      },
      delay: 50,
      callback: this.delegate(function () {
        if (hasError) {
          fail && fail(hasErrorJsList);
        } else {
          complete && complete();
        }
      })
    });
  },
  loadCSS: function (complete, fail) {
    if (this.data.css.length === 0) { return complete() }

    var hasError = false;
    var hasErrorCSSList = [];

    var head = HttpLibrary.getHead();
    this.forEach(this.data.css, function (href) {
      if (HttpLibrary.isUrlLoaded(href) || this.isTagLoaded('link', 'href', href)) {
        // Do nothing
      } else {
        var self = this;
        try {
          (function (href, head) {
            var link = document.createElement('link');
            link.setAttribute('href', href);
            link.setAttribute('rel', 'Stylesheet');
            link.setAttribute('type', 'text/css');
            head.appendChild(link);

            HttpLibrary.registerUrl(href);
          }).apply(window, [href, head]);
        } catch (e) {
          if (typeof self.data.error === 'function') {
            self.data.error(href, e.message);
            console.log('[Error] loadCSS: ' + href + ' \t[Meesage]: ' + e.message);
          }
          hasErrorCSSList.push(href);
          hasError = true;
        }
      }
    });

    if (!hasError) {
      complete && complete();
    } else {
      fail && fail(hasErrorCSSList);
    }
  },
  loadHtml: function (complete, fail) {
    var htmlToDownload = this.data.html.length;
    if (htmlToDownload === 0) { return complete() }

    var hasError = false;
    var hasErrorHtmlList = [];
    this.forEach(this.data.html, function (href) {
      if (HttpLibrary.isUrlLoaded(href)) {
        htmlToDownload--;
      } else {
        this.httpGet({
          url: href,
          success: this.delegate(function (content) {
            htmlToDownload--;
            HttpLibrary.registerUrl(href);

            var parent = (this.data.parent || document.body.appendChild(document.createElement('div')));
            if (typeof parent === 'string') { parent = document.getElementById(parent); }
            parent.innerHTML = content;
          }),
          error: this.delegate(function (msg) {
            htmlToDownload--;
            if (typeof this.data.error === 'function') { this.data.error(href, msg); }

            console.log('[Error] loadHtml: ' + href + ' \t[Meesage]: ' + msg);
            hasErrorHtmlList.push(href);
            hasError = true;
          })
        });
      }
    });

    // wait until all the external scripts are downloaded
    this.until({
      test: function () {
        return htmlToDownload === 0
      },
      delay: 50,
      callback: this.delegate(function () {
        if (hasError) {
          fail && fail(hasErrorHtmlList);
        } else {
          complete && complete();
        }
      })
    });
  },
  clone: function (obj) {
    var this$1 = this;

    var cloned = {};
    for (var p in obj) {
      var x = obj[p];

      if (typeof x === 'object') {
        if (x.constructor === Array) {
          var a = [];
          for (var i = 0; i < x.length; i++) { a.push(x[i]); }
          cloned[p] = a;
        } else {
          cloned[p] = this$1.clone(x);
        }
      } else {
        cloned[p] = x;
      }
    }

    return cloned
  },
  forEach: function (arr, callback) {
    var self = this;
    for (var i = 0; i < arr.length; i++) {
      callback.apply(self, [arr[i]]);
    }
  },
  delegate: function (func, obj) {
    var context = obj || this;
    return function () {
      func.apply(context, arguments);
    }
  },
  until: function (o) {
    if (o.test() === true) {
      o.callback();
    } else {
      window.setTimeout(this.delegate(function () {
        this.until(o);
      }), o.delay || 50);
    }
  },
  isTagLoaded: function (tagName, attName, value) {
    // Create a temporary tag to see what value browser eventually
    // gives to the attribute after doing necessary encoding
    var tag = document.createElement(tagName);
    tag[attName] = value;
    var tagFound = false;
    var tags = document.getElementsByTagName(tagName);
    this.forEach(tags, function (t) {
      if (tag[attName] === t[attName]) {
        tagFound = true;
        return false
      }
    });
    return tagFound
  }
};
$du.ensure = function (data, callback, failCall, scope) {
  if (typeof jQuery === 'undefined' && typeof Sys === 'undefined' && typeof Prototype === 'undefined') {
    return alert('jQuery, Microsoft ASP.NET AJAX or Prototype library not found. One must be present for ensure to work')
  }

  // There's a test criteria which when false, the associated components must be loaded. But if true,
  // no need to load the components
  if (typeof data.test !== 'undefined') {
    var test = function () {
      return data.test
    };

    if (typeof data.test === 'string') {
      test = function () {
        // If there's no such Javascript variable and there's no such DOM element with ID then
        // the test fails. If any exists, then test succeeds
        return !(window.eval('typeof ' + data.test) === 'undefined' &&
          document.getElementById(data.test) == null)
      };
    } else if (typeof data.test === 'function') {
      test = data.test;
    }

    // Now we have test prepared, time to execute the test and see if it returns null, undefined or false in any
    // scenario. If it does, then load the specified javascript/html/css
    if (test() === false || typeof test() === 'undefined' || test() == null) {
      new $du.EnsureExecutor(data, callback, failCall, scope);
    } else {
      // Test succeeded! Just fire the callback
      callback();
    }
  } else {
    // No test specified. So, load necessary javascript/html/css and execute the callback
    new $du.EnsureExecutor(data, callback, failCall, scope);
  }
};

uu$$5['RTY_3rd_Ensure'] = $du;

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */
function autoForJquery$5 (ref) {
  var t$ = ref;
  if (window) {
    if (window.jQuery && window.$) {
      window.$.templateLoader = t$.templateLoader;
      window.$.templateLoaderAgent = t$.templateLoaderAgent;
      window.$.cssjsLoader = t$.cssjsLoader;

      window.$['RTY_3rd_Ensure'] = t$['RTY_3rd_Ensure'];

      window.$ = window.$.extend(window.$, t$);
    }
  }
}

var loaderWrapper = uu$$5;
autoForJquery$5(uu$$5);

// 自动更新设置
/**
 * appId, 指定AppID
 * promptText, 指定提示说明
 * getDataCB. 获得数据后的处理方式
 * cb, 内置处理完成后，回调处理
 */
var uu$$7 = {};
uu$$7.hasUpdateChecked = false;
uu$$7.checkUpdate = function (appId, promptText, getDataCB, cb) {
  try {
    var t$ = this;
    var b$ = common$1.getBSb$();
    var $ = common$1.getJQuery$();

    var _checkUpdate = function (data) {
      try {
        var lastVersion = data.checkUpdate.lastVersion || '';
        var updateURL = data.checkUpdate.updateURL || '';

        // 检查是否有队苹果Apple 应用或者不使用
        var enableForMacOSAppStore = data.checkUpdate.enableForMacOSAppStore !==
          false;
        var enableForElectron = data.checkUpdate.enableForElectron !== false;
        var enableForNoMacOSAppStore = true;

        enableForMacOSAppStore = enableForMacOSAppStore && b$.pIsUseMacCocoEngine &&
          b$.App.getSandboxEnable();
        enableForElectron = enableForElectron && b$.pIsUseElectron;
        enableForNoMacOSAppStore = b$.pIsUseMacCocoEngine && !b$.App.getSandboxEnable();

        // 任意符合两种模式都可以启用
        if (enableForMacOSAppStore || enableForElectron || enableForNoMacOSAppStore) {
          // 比较
          var curAppVersion = b$.App.getAppVersion();
          console.log('last:' + lastVersion + ',cur:' + curAppVersion);
          if (common$1.compareVersion(lastVersion, curAppVersion) === 1) {
            var foundNewVersion = promptText || data.checkUpdate.prompt ||
              'The new version has been released.';
            alert(foundNewVersion);
            updateURL !== '' && b$.App.open(updateURL);
            cb && cb(data);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    // 尝试读取服务器配置
    var jsonFile = appId || b$.App.getAppId() + '.json';
    var serverUrl = 'https://romanysoft.github.io/assert-config/configs/' + jsonFile;
    $.getJSON(serverUrl, function (data) {
      if (t$.hasUpdateChecked) { return }
      t$.hasUpdateChecked = true;

      data = typeof data === 'object' ? data : {};
      data = data instanceof Array ? {
        'data': data
      } : data;
      getDataCB && getDataCB(data);
      _checkUpdate(data);
    });
  } catch (e) {
    console.error(e);
  }
};

// 检测及汇报状态
uu$$7.checkStartInfo = function (info) {
  var b$ = common$1.getBSb$();
  if (b$.pN) {
    communication.reportInfo({
      'SYS_state': 'Starting...',
      'Add_info': info || {}
    });
  }
};

// 检测在线补丁包
uu$$7.checkPatches = function (info) {
  loaderWrapper.RTY_3rd_Ensure.ensure({
    js: 'https://romanysoft.github.io/assert-config/patchs/config.js'
  }, function () {});
};

// 内核加入自启动部分代码
try {
  var $ = common$1.getJQuery$();
  var b$ = common$1.getBSb$();
  if ($) {
    $(document).ready(function () {
      console.log(
        '-------------Delayed loading method, do not reflect here-------');

      // / 默认添加提示新版本
      setTimeout(function () {
        uu$$7.checkStartInfo();

        if (b$.App.getSandboxEnable() && b$.App.getAppRunOnOS() === 'MacOSX') {
          console.log('------------- common app starting .... -------');
        } else {
          uu$$7.checkUpdate();
          // uu$.checkPatches()
        }
      }, 35 * 1000); // 35sec
    });
  }
} catch (e) {
  console.error(e);
}

// -----------------------------------------------
var update = uu$$7;

var _$19 = underscore._;

/**
 * 注册内置的事件处理
 * 捕获栈信息 see http://my.oschina.net/zhangstephen/blog/673838
 * 调用栈在定位问题时超级有用。好消息是，浏览器提供了这个信息。理所当然，查看错误异常中的栈属性不是标准的一部分
 * 但是只在新的浏览器中可以使用。所以，你就可以这样来把错误日志发送给服务器了
 * 该用法用来捕捉不在try... catch 内的Error
 */
try {
  var _callReport = function (e) {
    try {
      var message = common$1.RTYUtils.getErrorMessage(e);
      if (message && message !== '') {
        console.log('------异常捕获 _callReport -----');
        console.log(message);

        if (config.reportErr) {
          // 发送到服务器
          communication.reportInfo({
            type: 'HTML5_RTY_EXCEPTION',
            errorMessage: message
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.addEventListener('error', function (e) {
    _callReport(e);
  });
} catch (error) {
  console.error(error);
}

var util = {};
util = _$19.extend(util, compatibilityWrapper);
util = _$19.extend(util, common$1);
util = _$19.extend(util, config);
util = _$19.extend(util, webHelper);
util = _$19.extend(util, communication);
util = _$19.extend(util, googleLangIDMaps);
util = _$19.extend(util, loadLanguage);
util = _$19.extend(util, loaderWrapper);
util = _$19.extend(util, update);

var util$1 = {
  version: '1.1.4',
  util: util
};

try {
  if (window) {
    window.BS = BS;
    window.Romanysoft = {
      _: underscore._,
      Util: util$1,
      Observable: Observable,
      SelfClass: SelfClass,
      BS: BS
    };
    window.DoveMax = window.Romanysoft;
    window.GmagonSDK = window.Romanysoft;
  }
} catch (error) {
  console.warn(error);
}

var index = {
  _: underscore._,
  Util: util$1,
  BS: BS,
  Observable: Observable,
  SelfClass: SelfClass,
  version: '1.1.4'
};

module.exports = index;
