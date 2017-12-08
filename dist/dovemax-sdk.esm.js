/**
 * DoveMaxSDK ABI v20171208.9.3
 * (c) 2017 Romanysoft LAB. && GMagon Inc. 
 * @license MIT
 */
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lodash = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.4';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      reLeadingDot = /^\./,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)',
      rsOrdUpper = '\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        if (isObject(srcValue)) {
          stack || (stack = new Stack);
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(object[key], srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array == null ? 0 : array.length,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (reLeadingDot.test(string)) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            result = wait - timeSinceLastCall;

        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(args) {
      args.push(undefined, customDefaultsAssignIn);
      return apply(assignInWith, undefined, args);
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrim, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimEnd, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = (lodashFunc.name + ''),
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (typeof undefined == 'function' && typeof undefined.amd == 'object' && undefined.amd) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    undefined(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(commonjsGlobal));
});

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
      } else if (lodash.isFunction(propValue.clone)) {
        destination[property] = lodash.clone(propValue);
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

      if (lodash.isFunction(proto[member])) {
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
    this._name = lodash.uniqueId('SDK-Observable-');
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
      if (lodash.isString(e)) {
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

  var r = lodash.uniqueId('ncb' + lodash.now()) + lodash.uniqueId('n' + lodash.random(0, 99999));
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

    if (lodash.isFunction(func)) {
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
            window['eval'] = window.eval || function (params) {
              console.log('--------- eval function is not actual');
            };
            var js = "window.require(\"remote\").require(\"./romanysoft/maccocojs\")";
            ref.pN = ref.pNative = window['eval'](js);
          } catch (error) {
            try {
              var js$1 = "window.require(\"electron\").remote.require(\"./romanysoft/maccocojs\")";
              ref.pN = ref.pNative = window['eval'](js$1);
            } catch (e) {
              console.error(e);
            }
          }

          // 重新处理require,module的关系
          window.require = undefined;
          // window.module.exports = undefined
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
    console.assert(lodash.isObject($), 'Must be loaded jQuery library first \n');
    return $
  } catch (error) {
    console.error(error);
  }
};

//
// -----------------------------------------------
var common = $bc_$1;

var $bc_$2 = common;
// IAP 非本地模拟
$bc_$2.IAP_SE_KEY = 'RSSDK_SE_SANBOX_IAP';
$bc_$2.IAP_SE_OBJ = {};
$bc_$2.IAP_SE_Wrapper = {
  _caller: 0,
  productIdentifiers: [], // 商品的ID 数组
  caller: function () { // 消息回调处理
    if (this._caller === 0) {
      var $ = common.getJQuery$();
      this._caller = lodash.isUndefined($) ? (new Observable()) : $.Callbacks();
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
      this._pNoticeCenter = lodash.isUndefined($) ? (new Observable()) : $.Callbacks();
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
          if (lodash.isObject(obj)) {
            var info = obj.info;
            var notifyType = obj.notifyType;

            if (notifyType === t$.MessageType['ProductRequested']) {
              if (typeof info === 'string') {
                info = JSON.parse(info);
              }

              t$.data.productIsRequested = true;
              t$.data.productInfoList = info;

              lodash.each(t$.data.productInfoList, function (product, index, list) {
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
        if (lodash.isFunction($bc_$2.cb_handleIAPCallback)) {
          $bc_$2.cb_handleIAPCallback && $bc_$2.cb_handleIAPCallback(obj);
        } else {
          cb && cb(obj);
        }

        // ////////////////////////////////////////////////////////////////
      }, true);

      // / 数据校验
      console.assert(lodash.isString(params['cb_IAP_js']) === true, 'must be function string');

      // /Ian(原先的方式)
      if (lodash.isArray(paramOptions['productIds'])) {
        params['productIds'] = paramOptions['productIds'] || [];
      }

      // /Ian 2016.12.06 现在的方式. 支持更高级的商品属性定义传入
      params['products'] = [];
      if (lodash.isArray(paramOptions['products'])) { // [{productIdentifier, description, buyUrl, price}]
        try {
          var productIds = [];
          lodash.each(paramOptions['products'], function (product, index, list) {
            productIds.push(product.productIdentifier);
          });

          if (lodash.isUndefined(params['productIds'] || lodash.isNull(params['productIds']))) {
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
          console.assert(lodash.isString(params.cb_IAP_js) === true, 'must be function string');

          var fnc = window.eval(params.cb_IAP_js);
          if (lodash.isFunction(fnc)) {
            fnc && fnc(obj);
          }
        });

        // /注册商品ID
        $bc_$2.IAP_SE_Wrapper.productIdentifiers = params.productIds || [];

        var productsInfo = [];
        lodash.each(params.productIds, function (id, index, list) {
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

    var checkFalse = lodash.isUndefined(productIdentifier) || lodash.isNull(productIdentifier);
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
        if (lodash.isObject(obj)) {
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
      lodash.each($bc_$2.IAP_SE_Wrapper.productIdentifiers, function (productID, index, list) {
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
        if (lodash.isObject(obj)) {
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

  // 获得系统中可用的字体数据
  getAvailableFonts: function () {
    if ($bc_$4.pN) {
      var fontsDic = $bc_$4.pN.app.getAvailableFonts();
      try {
        return JSON.parse(fontsDic)
      } catch (e) {
        console.error(e);
      }
      return fontsDic
    }

    return {
      // {familyName:"", fontName:"", displayName:""}
      fonts: []
    }
  },

  // 获得App是否在沙盒内
  getSandboxEnable: function () {
    if ($bc_$4.pN) {
      var sandboxEnable = $bc_$4.pN.app.getSandboxEnable();
      return sandboxEnable
    }
    return false
  },

  // 获取App是否已经注册(证书信息已经安装)
  getIsRegistered: function () {
    var t$ = this;
    if ($bc_$4.pN) {
      if (t$.getSandboxEnable()) { return true }
      return $bc_$4.pN.app.getIsRegistered()
    }
    return false
  },

  // 获取App内部注册信息(证书信息)
  getRegInfoJSONString: function () {
    if ($bc_$4.pN) {
      var str = $bc_$4.pN.app.getRegInfoJSONString();
      return str
    }
    return ''
  },

  // 获得App内部当前注册信息(证书信息)更多信息
  /**
    "{\"certificate\":
    \"eyJsaWNlbnNlIjoiMTQ5ODAzNTA4NC0xNTE2NDY0MDAwXG4wODhlYjk3YTMxYWZjMDRhYzM2MWM3NDkxYjg1YzUzZFxuYjBmZGNiYmU0N2JjMmFhMDc5Nzc5MmE4MGIxMWM1MDIiLCJuYW1lIjoiVXNlck5hbWVfX251bS45RzEwRSJ9\",
    \"data\":
    {\"registeredOrIsValid\":true,\"noRegType\":0,
    \"endDate\":\"1516464000\",\"regDate\":\"1498035084\",\"noRegInfo\":\"\",
    \"endDateStr\":\"2018-01-21 00:00:00\",
    \"license\":\"1498035084-1516464000\\n088eb97a31afc04ac361c7491b85c53d\\nb0fdcbbe47bc2aa0797792a80b11c502\",
    \"regDateStr\":\"2017-06-21 16:51:24\",\"name\":\"UserName__num.9G10E\",\"serviceEnd\":false}}"
  **/
  getRegInfoExJSONString: function () {
    if ($bc_$4.pN) {
      var str = $bc_$4.pN.app.getRegInfoExJSONString();
      return str
    }
    return ''
  },

  // /////////////////////////////////////////////////////////////////////////
  // 查询是否为授权证书订阅版本
  getIsSubscriptionProduct: function () {
    var isSubscriptionProduct = false;
    if ($bc_$4.pN) {
      isSubscriptionProduct = $bc_$4.pN.app.getIsSubscriptionProduct();
    }
    return isSubscriptionProduct
  },

  // 查询是否需要授权证书{必须满足为订阅产品及没有有效注册}
  getIsNeedCertificate: function () {
    var need = false;
    if ($bc_$4.pN) {
      need = $bc_$4.pN.app.getIsNeedCertificate();
    }
    return need
  },

  // 本地验证证书的是否有效
  validCertificate: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['certificate'] = params['certificate'] || '';

        $bc_$4.pN.window.validCertificate(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 本地安装授权证书
  installCertificate: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['certificate'] = params['certificate'] || '';

        $bc_$4.pN.window.installCertificate(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 本地卸载所有授权证书（即：当前正在安装或者使用的证书）
  uninstallAllCertificates: function (jsonObj, cb) {
    if ($bc_$4.pN) {
      try {
        var params = jsonObj || {};
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);

        $bc_$4.pN.window.uninstallAllCertificates(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // /////////////////////////////////////////////////////////////////////////////

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
    var defaultPort = 8888;
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getHttpServerPort() || defaultPort
    }

    return defaultPort
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
  checkFileIsZero: $bc_$4.checkFileIsZeroSize = function (filePath) {
    if (filePath.trim() === '') { return false }

    if ($bc_$4.pN) {
      var _path = filePath || $bc_$4.pN.path.tempDir();
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
  createEmptyFile: $bc_$4.createEmptyFile = function (filePath, cb) {
    if ($bc_$4.pN) {
      var _path = filePath || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.window.createEmptyFile(JSON.stringify({
        path: _path,
        callback: $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true)
      }))
    }
  },

  // 创建目录
  createDir: $bc_$4.createDir = function (dirPath, atts, cb) {
    if ($bc_$4.pN) {
      try {
        var params = {};
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['path'] = dirPath || ($bc_$4.pN.path.tempDir() + 'tmp_dir001');
        if (atts) { params['atts'] = atts || {}; }

        $bc_$4.pN.window.createDir(JSON.stringify(params));
      } catch (e) {
        console.error(e);
      }
    }
  },

  // 删除文件
  removeFile: $bc_$4.removeFile = function (filePath, cb) {
    if ($bc_$4.pN) {
      var _path = filePath || ($bc_$4.pN.path.tempDir() + 'tmp.txt');
      return $bc_$4.pN.window.removeFile(JSON.stringify({
        path: _path,
        callback: $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true)
      }))
    }
  },

  // 删除目录
  removeDir: $bc_$4.removeDir = function (dirPath, cb) {
    if ($bc_$4.pN) {
      try {
        var params = {};
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_$4._get_callback(function (obj) {
          cb && cb(obj);
        }, true);
        params['path'] = dirPath || ($bc_$4.pN.path.tempDir() + '/tmp_dir001');

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
  /**
   * 获得软件供应商的名称
   */
  getVendorName: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getVendorName()
    }
    return ''
  },

  /**
   * 获得软件供应商的网站
   */
  getVendorWebSiteURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getVendorWebSiteURL()
    }
    return ''
  },

  /**
   * 获得软件最新新闻数据的json格式数据url
   */
  getNewsJsonURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getNewsJsonURL()
    }
    return ''
  },

  /**
   * 获得软件的其他附加配置JSON数据的URL
   */
  getAdditionalConfigURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getAdditionalConfigURL()
    }
    return ''
  },

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

  /**
   * 获得软件支持网站的URL地址
   */
  getSupportPageURL: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getSupportPageURL()
    }
    return ''
  },

  /**
   * 获得软件支持邮箱的地址
   */
  getSupportEmail: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.getSupportEmail()
    }
    return ''
  },

  // {Languages}
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

  // 获取本地与浏览器语言标识映射表
  nativeApple2WebKitLanguageMap: {
    'Unknown': [''],
    'en': ['en', 'en-US', 'en-us'], // 英语

    'fr': ['fr', 'fr-FR', 'fr-fr', 'fr-US'], // French (fr) 法语

    'de': ['de', 'de-DE', 'de-de', 'de-US'], // German (de) 德语

    'zh-Hans': ['zh', 'zh-CN', 'zh-cn', 'zh-Hans', 'zh-Hans-US'], // Chinese (Simplified) (zh-Hans) 中文简体

    'zh-Hant': ['zh-TW', 'zh-tw', 'zh-Hant', 'zh-Hant-US'], // Chinese (Traditional) (zh-Hant) 中文繁体

    'ja': ['ja', 'ja-JP', 'ja-jp', 'ja-US'], // Japanese (ja) 日语

    'es': ['es', 'es-ES', 'es-es', 'es-US'], // Spanish (es) 西班牙语

    'es-MX': ['es-MX', 'es-XL', 'es-xl'], // Spanish (Mexico) (es-MX) 西班牙语（墨西哥）

    'it': ['it', 'it-IT', 'it-it', 'it-US'], // Italian (it) 意大利语

    'nl': ['nl', 'nl-NL', 'nl-nl', 'nl-US'], // Dutch (nl) 荷兰语

    'ko': ['ko', 'ko-KR', 'ko-kr', 'ko-US'], // Korean (ko) 韩语

    'pt': ['pt', 'pt-BR', 'pt-br', 'pt-US'], // Portuguese (pt) 葡萄牙语

    'pt-PT': ['pt-PT', 'pt-pt', 'pt-US'], // Portuguese (Portugal) (pt) 葡萄牙语（葡萄牙）

    'da': ['da', 'da-DK', 'da-da', 'da-US'], // Danish (da) 丹麦语

    'fi': ['fi', 'fi-FI', 'fi-fi', 'fi-US'], // Finnish (fi) 芬兰语

    'nb': ['nb', 'nb-NO', 'nb-no', 'nb-US'], // Norwegian Bokmal (nb) 挪威语

    'sv': ['sv', 'sv-SE', 'sv-se', 'sv-US'], // Swedish (sv) 瑞典语

    'ru': ['ru', 'ru-RU', 'ru-ru', 'ru-US'], // Russian (ru) 俄语

    'pl': ['pl', 'pl-PL', 'pl-pl', 'pl-US'], // Polish (pl) 波兰语

    'tr': ['tr', 'tr-TR', 'tr-tr', 'tr-US'], // Turkish (tr) 土耳其语

    'ar': ['ar', 'AR', 'ar-US'], // Arabic (ar) 阿拉伯语

    'th': ['th', 'th-TH', 'th-th', 'th-US'], // Thai (th) 泰语

    'cs': ['cs', 'cs-CZ', 'cs-cz', 'cs-US'], // Czech (cs) 捷克语

    'hu': ['hu', 'hu-HU', 'hu-hu', 'hu-US'], // Hungarian (hu) 匈牙利语

    'ca': ['ca', 'ca-ES', 'ca-es', 'ca-US'], // Catalan (ca) 加泰罗尼亚语

    'hr': ['hr', 'hr-HR', 'hr-hr', 'hr-US'], // Croatian (hr) 克罗地亚语

    'el': ['el', 'el-GR', 'el-gr', 'el-US'], // Greek (el) 希腊语

    'he': ['he', 'he-IL', 'he-il', 'he-US'], // Hebrew (he) 希伯来语

    'ro': ['ro', 'ro-RO', 'ro-ro', 'ro-US'], // Romanian (ro) 罗马尼亚语

    'sk': ['sk', 'sk-SK', 'sk-sk', 'sk-US'], // Slovak (sk) 斯洛伐克语

    'uk': ['uk', 'uk-UA', 'uk-ua', 'uk-US'], // Ukrainian (uk) 乌克兰语

    'id': ['id', 'ID', 'id-ID', 'id-id', 'id-US'], // Indonesian (id) 印尼语

    'ms': ['ms', 'MS', 'ms-MS', 'ms-ms', 'ms-US'], // Malay (ms) 马来西亚语

    'vi': ['vi', 'vi-VN', 'vi-vn', 'vi-US'] // Vietnamese (vi) 越南语
  },

  // 获得兼容浏览器的语言标识, 发起者，为Native
  getCompatibleWebkitLanguageList: function (_getType) {
    var getType = _getType || 'Native2Webkit'; // 获取类型，默认是获取兼容WebKit的语言标识数组

    var defaultLanguage = 'en';
    // 本地对应浏览器的语言标识
    var NativeApple2WebKitLanguageMap = this.nativeApple2WebKitLanguageMap;

    if (getType === 'Native2Webkit') { // 先获取Native的语言，然后查找Map
      var appleLanguage = 'en-US';
      if ($bc_$4.pN) {
        appleLanguage = $bc_$4.pN.app.curAppleLanguage();
      }

      if (NativeApple2WebKitLanguageMap.hasOwnProperty(appleLanguage)) {
        return NativeApple2WebKitLanguageMap[appleLanguage]
      }

      var n2wKeys = Object.getOwnPropertyNames(NativeApple2WebKitLanguageMap);
      for (var i = 0; i < n2wKeys.length; ++i) {
        var valueList = NativeApple2WebKitLanguageMap[n2wKeys[i]];
        if (valueList.indexOf(appleLanguage) > -1) {
          return valueList
        }
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

  // 获得苹果系统内置的语言包
  getAppleSupportLanguagList: function () {
    if ($bc_$4.pN) {
      var jsonstr = $bc_$4.pN.app.curAppleSupportLanguagesJSONString() || JSON.stringify([]);
      return JSON.parse(jsonstr)
    }
    return []
  },

  // 设置用户的语言
  setUserLanguage: function (language) {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.setUserLanguage(language || 'en-US')
    } else if (window) {
      try {
        window.localStorage.setItem('APP_USER_SETTING_LANGUAGE', language);
      } catch (error) { console.error(error); }
    }
  },

  // 获取用户设置的语言
  getUserLanguage: function () {
    if ($bc_$4.pN) {
      return $bc_$4.pN.app.curUserLanguage()
    } else if (window) {
      try {
        return window.localStorage.getItem('APP_USER_SETTING_LANGUAGE') || 'en-US'
      } catch (error) { console.error(error); }
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
var nwindow = $bc_$6;

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

  getImageFileInfo: function (paramOptions, cb) {
    try {
      var params = {};
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_$10._get_callback(function (obj) {
        cb && cb(obj);
      }, true);
      params['path'] = paramOptions['path'] || ''; // image 文件路径

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key];
        }
      }

      if ($bc_$10.pN) {
        $bc_$10.pN.binaryFileWriter.getImageFileInfo(JSON.stringify(params));
      } else {
        console.warn('call native engine get image file info ...');
        cb && cb({
          success: true,
          data: { width: 512, height: 512 }
        });
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

      var extendObj = lodash.clone($bc_$11.pCorePlugin);
      extendObj['callMethod'] = 'initCore';
      if (lodash.isString(cbFuncName)) {
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
        if (lodash.isFunction(t$.cb_dragdrop)) {
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
            lodash.each(e.dataTransfer.files, function (fileObj, index, list) {
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
  CallTaskExit: 'type_calltask_exit',
  CallTaskSuccess: 'type_calltask_success',
  CancelCallTask: 'type_calltask_cancel'

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

  lodash.each(commandList || [], function (ele, index, list) {
    var formatEle = '';
    if (lodash.isBoolean(ele)) { formatEle = "'" + ele + "'"; }
    if (lodash.isNumber(ele)) { formatEle = ele; }
    if (lodash.isString(ele)) { formatEle = "'" + ele + "'"; }
    if (lodash.isFunction(ele)) { formatEle = null; }
    if (lodash.isArray(ele)) { formatEle = "'" + JSON.stringify(ele) + "'"; }
    if (lodash.isDate(ele)) { formatEle = "'" + JSON.stringify(ele) + "'"; }
    if (lodash.isRegExp(ele)) { formatEle = "'" + ele.toString() + "'"; }
    if (lodash.isObject(ele)) { formatEle = "'" + JSON.stringify(ele) + "'"; }
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
    var extendObj = lodash.clone($bc_$13.pCorePlugin);
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
  lodash.now(), // TaskID
  [{ // TaskCommand
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
    var extendObj = lodash.clone($bc_$13.pCorePlugin);
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
      if (lodash.isFunction($bc_$14.cb_selectOutDir)) {
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
        if (lodash.isFunction($bc_$14.cb_selectOutFile)) {
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
    if (lodash.isString(e)) {
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

    var t$ = Tool;
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
    return lodash.isUndefined(o) || lodash.isNull(o)
  },
  isUndefinedOrNullOrFalse: function (o) {
    var t$ = Tool;
    return t$.isUndefinedOrNull(o) || o === false
  },
  isObject: lodash.isObject,
  isError: lodash.isError,
  isNaN: lodash.isNaN,
  isFinite: lodash.isFinite,
  isArguments: lodash.isArguments,
  isElement: lodash.isElement,
  isEmpty: lodash.isEmpty,
  isMatch: lodash.isMatch,
  isEqual: lodash.isEqual,
  isPromise: function (val) {
    return val && typeof val.then === 'function'
  },
  isArray: lodash.isArray,
  isBoolean: lodash.isBoolean,
  isString: lodash.isString,
  isNull: lodash.isNull,
  isUndefined: lodash.isUndefined,
  isNumber: lodash.isNumber,
  isDate: lodash.isDate,
  isRegExp: lodash.isRegExp,
  isFunction: lodash.isFunction,
  isBlob: function (o) {
    return Object.prototype.toString.call(o) === '[object Blob]'
  },
  isBrowser: function () {
    var t$ = Tool;
    var isBrowser = t$.isWindow(window);
    return isBrowser
  },
  isNodeJs: function () {
    var t$ = Tool;
    return !(t$.isBrowser())
  },
  isWindow: function (arg) {
    // Safari returns DOMWindow
    // Chrome returns global
    // Firefox, Opera & IE9 return Window
    var objStr = Object.prototype.toString.call(arg || this);
    switch (objStr) {
      case '[object DOMWindow]':
      case '[object Window]':
      case '[object global]':
        return true
    }
    try {
      if (arg instanceof Window) {
        return true
      }
    } catch (e) {
      console.error(e);
    }

    // /window objects always have a `self` property;
    // /however, `arg.self == arg` could be fooled by:
    // /var o = {};
    // /o.self = o;
    if ('self' in arg) {
      // `'self' in arg` is true if
      // the property exists on the object _or_ the prototype
      // `arg.hasOwnProperty('self')` is true only if
      // the property exists on the object
      var hasSelf = arg.hasOwnProperty('self');
      var self;
      try {
        if (hasSelf) {
          self = arg.self;
        }
        delete arg.self;
        if (hasSelf) {
          arg.self = self;
        }
      } catch (e) {
        // IE 7&8 throw an error when window.self is deleted
        return true
      }
    }
    return false
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
    var t$ = Tool;
    allowTypes = allowTypes || [];
    if (t$.isUndefinedOrNull(param)) { return [] }
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
    var t$ = Tool;
    try {
      if (t$.isString(err)) {
        msg = err;
      } else if (t$.isError(err)) {
        msg = err.message;
      } else if (t$.isObject(err)) {
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
        msg += '[RTY_CANT_TYPE] = ' + t$.getType(err);
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
    var t$ = Tool;
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
    var buf;
    var t$ = Tool;
    if (Obj instanceof Array) {
      buf = [];
      var i = Obj.length;
      while (i--) {
        buf[i] = t$.objClone(Obj[i]);
      }
      return buf
    } else if (Obj instanceof Object) {
      buf = {};
      for (var k in Obj) {
        if (Obj.hasOwnProperty(k)) {
          buf[k] = t$.objClone(Obj[k]);
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
      if (lodash.isNumber(version1) && lodash.isNumber(version2)) {
        if (version1 > version2) { return 1 }
        if (version1 === version2) { return 0 }
        if (version1 < version2) { return -1 }
      } else if (lodash.isNumber(version1) || lodash.isNumber(version2)) {
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
    var t$ = Tool;
    var actualType = t$.getType(obj);
    if (actualType !== type) {
      var errMsg = 'TestType:[' + type + '], actual:[' + actualType + '].';
      console.assert(false, errMsg);
    }
  }

};

var logCord$1 = '[SDK.Proxy.Client.Websocket.Go]';

var __key$1 = 'proxy-client-websocket-go';
var __msgPrefix = __key$1 + '-' + lodash.now() + lodash.random(1, Number.MAX_SAFE_INTEGER) + '-';
var TypeMsg$1 = {
  OnCreateError: __msgPrefix + 'OnCreateError', // Websocket 创建失败
  OnWSOpen: __msgPrefix + 'OnWSOpen', // WebSocket 创建并连接上
  OnWSClose: __msgPrefix + 'OnWSClose', // WebSocket 意外关闭

  OnWSGetServerMessage: __msgPrefix + 'OnWSGetServerMessage', // WebSocket 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip = "\nYou must use init(config) function first, the use listen to start!!!!\n";

var ClientIOType = {
  SocketIO: 'Socket.io.client', // 适用于Go服务器使用的Socket.IO
  EngineIO: 'Engine.io.client' // 适用于Go服务器使用的Engine.IO
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
    this.log(logCord$1, ' _events count = ' + lodash.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$1, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: { // 包含的基本配置
    ip: '127.0.0.1',
    port: '8888',
    protocol: 'ws://',
    reqUrl: '',
    clientIOType: ClientIOType.SocketIO, // 默认使用这种的Socket链接方式
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    customSendEventDefine: 'sendMsgEvent', // 定义核心交互的事件类型
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
    this.config = lodash.extend(this.config, inConfig);
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
  wsHandler: null, // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [], // 缓存发送信息部分
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
    lodash.each(that.cacheSendMessage, function (curMessage) {
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
  autoCWSTimesIndex: 0, // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: lodash.uniqueId(__key$1), // 客户端唯一ID
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
  // 向服务器发送注册信息，测试返回
  __sendWSRegisterInfo: function () {
    var __agent = this;
    __agent.sendMessage(JSON.stringify({
      'msg': {
        'wsid': __agent.wsID
      },
      'type': 'c_notice_id_Info'
    }));
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
        __agent.__sendWSRegisterInfo();
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
        if (lodash.isObject(data)) {
          msgPackage = JSON.stringify(data);
          __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
        } else if (lodash.isString(data)) {
          msgPackage = data;
          __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
        } else if (lodash.isNull(data)) {
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
          if (lodash.isObject(data)) {
            msgPackage = JSON.stringify(data);
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else if (lodash.isString(data)) {
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
        __agent.__sendWSRegisterInfo();
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
lodash.each(TypeMsg$1, function (eventType, key, list) {
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

var ProxyClientWebsocketForGo = SelfClass.extend(__$p$$1);

var logCord$2 = '[SDK.Proxy.Client.Websocket.Node]';

var __key$2 = 'proxy-client-websocket-node';
var __msgPrefix$1 = __key$2 + '-' + lodash.now() + lodash.random(1, Number.MAX_SAFE_INTEGER) + '-';
var TypeMsg$2 = {
  OnCreateError: __msgPrefix$1 + 'OnCreateError', // Websocket 创建失败
  OnWSOpen: __msgPrefix$1 + 'OnWSOpen', // WebSocket 创建并连接上
  OnWSClose: __msgPrefix$1 + 'OnWSClose', // WebSocket 意外关闭

  OnWSGetServerMessage: __msgPrefix$1 + 'OnWSGetServerMessage', // WebSocket 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix$1 + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip$1 = "\nYou must use init(config) function first, the use listen to start!!!!\n";

var ClientIOType$1 = {
  SocketIO: 'Socket.io.client', // 适用于Node服务器使用的Socket.IO
  EngineIO: 'Engine.io.client' // 适用于Node服务器使用的Engine.IO
};

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
  ClientIOType: ClientIOType$1,
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var _events = this.mc.getEvents();
    this.log(logCord$2, ' _events count = ' + lodash.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$2, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: { // 包含的基本配置
    ip: '127.0.0.1',
    port: '8888',
    protocol: 'ws://',
    reqUrl: '',
    clientIOType: ClientIOType$1.SocketIO, // 默认使用这种的Socket链接方式
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    customSendEventDefine: 'sendMsgEvent', // 定义核心交互的事件类型
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

    this.log(logCord$2, __key$2 + ' call initWithConfig function ....');
    this.config = lodash.extend(this.config, inConfig);
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
  wsHandler: null, // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [], // 缓存发送信息部分
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
    lodash.each(that.cacheSendMessage, function (curMessage) {
      // 做好区分的准备
      if (that.config.clientIOType === ClientIOType$1.SocketIO) {
        that.wsHandler.send(that.config.customSendEventDefine, curMessage);
      } else if (that.config.clientIOType === ClientIOType$1.EngineIO) {
        that.wsHandler.send(curMessage);
      }

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
  autoCWSTimesIndex: 0, // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: lodash.uniqueId(__key$2), // 客户端唯一ID
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
        that.createWS();
      }
      ++that.autoCWSTimesIndex;
    }
  },
  createWS: function () { // 建立Websocket 客户端
    var that = this;
    if (that.config.clientIOType === ClientIOType$1.SocketIO) {
      that.__createWSWithSocketIO();
    } else if (that.config.clientIOType === ClientIOType$1.EngineIO) {
      that.__createWSWithEngineIO();
    }
  },
  // --------------------------------------------------------
  // 向服务器发送注册信息，测试返回
  __sendWSRegisterInfo: function () {
    var __agent = this;
    __agent.sendMessage(JSON.stringify({
      'user_id': __agent.wsID,
      'msg_type': 'c_notice_id_Info'
    }));
  },
  // --------------------------------------------------------
  __createWSWithSocketIO: function () {
    var __agent = this;
    var url = __agent.getUrl();
    __agent.log(logCord$2, 'create new socket connect, wsurl = ' + url);

    var warning = "\n    This way use the Socket.IO client interface api, Please download it, and use the script in you web source\n    see: https://github.com/socketio/socket.io-client\n    ";

    try {
      if (Tool.isUndefinedOrNull(window.io)) {
        return console.warn(logCord$2, warning)
      }

      var ws = window.io(url);
      ws.on('connect', function () {
        __agent.log(logCord$2, 'is connecting ...');
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
        __agent.log(logCord$2, event, data);
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
        if (lodash.isObject(data)) {
          msgPackage = JSON.stringify(data);
          __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
        } else if (lodash.isString(data)) {
          msgPackage = data;
          __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
        } else if (lodash.isNull(data)) {
          console.warn(logCord$2, 'cannot process null data obj ....');
        } else {
          console.warn(logCord$2, 'cannot process this message type ....');
        }
      });
      ws.on('event', function (data) {
        __agent.log(logCord$2, 'on ws.on("event")');
      });
      ws.on('disconnect', function () {
        try {
          __agent.log(logCord$2, 'onclose code = ');
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
      __agent.log(logCord$2, error);
      __agent.isRunning = false;
      // notice some message for others
      __agent.noticeCreateError({ errCode: error });
    }
  },
  __createWSWithEngineIO: function () {
    var __agent = this;
    var url = __agent.getUrl();
    __agent.log(logCord$2, 'create new socket connect, wsurl = ' + url);
    var warning = "\n    This way use the Engine.IO client interface api, Please download it, and use the script in you web source\n    see: https://github.com/socketio/engine.io-client\n    ";

    try {
      if (Tool.isUndefinedOrNull(window.io)) {
        return console.warn(logCord$2, warning)
      }
      var ws = new window.eio.Socket(url);
      ws.on('open', function () {
        __agent.log(logCord$2, 'is connecting ...');
        __agent.wsHandler = ws;
        __agent.isRunning = true;

        ws.on('message', function (data) {
          __agent.isRunning = true;
          __agent.log(logCord$2, data);

          var msgPackage = '';
          // Decodeing 匹配大部分数据格式，进行处理
          if (Tool.isBlob(data)) {
            Tool.blobData2String(data, function (text) {
              msgPackage = text;
              __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
            });
            return
          }
          if (lodash.isObject(data)) {
            msgPackage = JSON.stringify(data);
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else if (lodash.isString(data)) {
            msgPackage = data;
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else {
            console.warn(logCord$2, 'cannot process this message type ....');
          }
        });
        ws.on('close', function () {
          try {
            __agent.log(logCord$2, 'onclose code = ');
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
      __agent.log(logCord$2, error);
      __agent.isRunning = false;
      // notice some message for others
      __agent.noticeCreateError({
        errCode: error
      });
    }
  }

};

// 批量处理注册及接收方式
lodash.each(TypeMsg$2, function (eventType, key, list) {
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

var ProxyClientWebsocketForNode = SelfClass.extend(__$p$$3);

var logCord$3 = '[SDK.Proxy.Client.Websocket.Python]';

var __key$3 = 'proxy-client-websocket-python';
var __msgPrefix$2 = __key$3 + '-' + lodash.now() + lodash.random(1, Number.MAX_SAFE_INTEGER) + '-';
var TypeMsg$3 = {
  OnCreateError: __msgPrefix$2 + 'OnCreateError', // Websocket 创建失败
  OnWSOpen: __msgPrefix$2 + 'OnWSOpen', // WebSocket 创建并连接上
  OnWSClose: __msgPrefix$2 + 'OnWSClose', // WebSocket 意外关闭

  OnWSGetServerMessage: __msgPrefix$2 + 'OnWSGetServerMessage', // WebSocket 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix$2 + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip$2 = "\nYou must use init(config) function first, the use listen to start!!!!\n";

// ------------------------------------------------------------------------
// Class ProxyClientWebsocketPrivate
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
    this.log(logCord$3, ' _events count = ' + lodash.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$3, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: { // 包含的基本配置
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
    that.log(logCord$3, __key$3 + ' call initWithConfig function ....');
    that.config = lodash.extend(that.config, inConfig);
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
  wsHandler: null, // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [], // 缓存发送信息部分
  sendMessage: function (message, first) {
    if ( first === void 0 ) first = false;
 // 客户端向服务器发送消息
    var that = this;
    if (!that.isRunning || !that.wsHandler) {
      that.cacheSendMessage.push(message);
      console.warn(logCord$3, 'WebSocket is not running .....');
      return
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message);

    that._traceLogCacheSendMessageCount();
    lodash.each(that.cacheSendMessage, function (curMessage) {
      that.wsHandler.send(curMessage);

      that._traceLogEventsCount();
      that.mc.trigger(TypeMsg$3.OnSendMessageToServer, curMessage);
      that.cacheSendMessage.shift();
    });
    that._traceLogCacheSendMessageCount();
  },
  onReceiveMessage: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnWSGetServerMessage, message);
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnCreateError, message);
  },
  noticeWSOpen: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnWSOpen, message);
  },
  noticeWSClosed: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$3.OnWSClose, message);
  },
  // --------------------------------------------------------
  // Websocket连接处理内核核心处理函数
  autoCWSTimesIndex: 0, // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: lodash.uniqueId(__key$3), // 客户端唯一ID
  showInitializedTip: function () {
    console.warn(logCord$3, initializedTip$2);
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
        that.log(logCord$3, 'try create new socket connect, port = ' + that.config.port);
        that.createWS(that.getUrl());
      }
      ++that.autoCWSTimesIndex;
    }
  },
  createWS: function (url) { // 建立Websocket 客户端
    var __agent = this;

    var WebSocket;
    try {
      if (!Tool.isUndefinedOrNullOrFalse(window)) {
        WebSocket = window.WebSocket || window.MozWebSocket || function WebSocket (url) {
          this.url = url;
        };
      } else {
        WebSocket = function WebSocket (url) {
          this.url = url;
        };
      }
    } catch (error) {
      console.error('can not found WebSocket Object');
    }

    __agent.log(logCord$3, 'create new socket connect, wsurl = ' + url);

    try {
      var ws = new WebSocket(url); // 启动监听服务
      if (ws) {
        // ==== onopen
        ws.onopen = function (evt) {
          var that = this;
          __agent.wsHandler = this;

          if (that.readyState === 1) {
            __agent.log(logCord$3, 'is connecting ...');
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
          __agent.log(logCord$3, evt.data);

          var msgPackage = '';
          // Decodeing 匹配大部分数据格式，进行处理
          if (Tool.isBlob(evt.data)) {
            Tool.blobData2String(evt.data, function (text) {
              msgPackage = text;
              __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
            });
            return
          }
          if (lodash.isObject(evt.data)) {
            msgPackage = JSON.stringify(evt.data);
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else if (lodash.isString(evt.data)) {
            msgPackage = evt.data;
            __agent.onReceiveMessage(msgPackage); // 按接口要求，尽量回传字符串
          } else {
            console.warn(logCord$3, 'cannot process this message type ....');
          }
        };

        // ===== onerror = function (evt) {
        ws.onerror = function (evt) {

        };

        // ==== onclose
        ws.onclose = function (evt) {
          try {
            __agent.log(logCord$3, 'onclose code = ' + evt);
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
      __agent.log(logCord$3, error);
      __agent.isRunning = false;
      // notice some message for others
      __agent.noticeCreateError({ errCode: error });
    }
  }
  // --------------------------------------------------------

};

// 批量处理注册及接收方式
lodash.each(TypeMsg$3, function (eventType, key, list) {
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

var ProxyClientWebsocketForPython = SelfClass.extend(__$p$$4);

var $bc_$15 = task;

var logCord$4 = '[SDK.Proxy.Client.NativeFork]';
var __key$4 = 'proxy-client-native-fork';
var __msgPrefix$3 = __key$4 + '-' + lodash.now() + lodash.random(1, Number.MAX_SAFE_INTEGER) + '-';

var TNMT = TypeNativeMessageType;
var TypeMsg$4 = {
  OnCreateError: __msgPrefix$3 + 'OnCreateError', // 创建失败
  OnRunning: __msgPrefix$3 + 'OnRunning', // 创建并连接上

  OnGetServerMessage: __msgPrefix$3 + 'OnGetServerMessage', // 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix$3 + 'OnSendMessageToServer' // 向服务器发送信息
};

var initializedTip$3 = "\nYou must use init(config) function first, the use listen to start!!!!\n";

// ------------------------------------------------------------------------
// Class ProxyClientNativeForkPrivate
var __$p$$5 = {
  name: __key$4,
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
    return TypeMsg$4
  },
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var _events = this.mc.getEvents();
    this.log(logCord$4, ' _events count = ' + lodash.keys(_events).length);
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord$4, ' cacheMessage count = ' + this.cacheSendMessage.length);
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {},
  isRunning: false,
  initWithConfig: function (inConfig) {
    if ( inConfig === void 0 ) inConfig = {};

    this.log(logCord$4, __key$4 + ' call initWithConfig function ....');
    this.config = lodash.extend(this.config, inConfig);
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
  cacheSendMessage: [], // 缓存发送信息部分
  sendMessage: function (message, first) {
    if ( first === void 0 ) first = false;
 // 客户端向服务器发送消息
    var that = this;
    if (!that.isRunning) {
      that.cacheSendMessage.push(message);
      return console.warn(logCord$4, 'NativeFork is not running .....')
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message);

    that._traceLogCacheSendMessageCount();
    lodash.each(that.cacheSendMessage, function (curMessage) {
      // 发送信息
      that._processNativeForkMessage(curMessage);

      that._traceLogEventsCount();
      that.mc.trigger(TypeMsg$4.OnSendMessageToServer, curMessage);
      that.cacheSendMessage.shift();
    });
    that._traceLogCacheSendMessageCount();
  },
  onReceiveMessage: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$4.OnGetServerMessage, message);
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$4.OnCreateError, message);
  },
  noticeOnRunning: function (message) {
    var that = this;
    that._traceLogEventsCount();
    that.mc.trigger(TypeMsg$4.OnRunning, message);
  },
  // -------------------------------------------------------
  showInitializedTip: function () {
    console.warn(logCord$4, initializedTip$3);
  },
  _processNativeForkMessage: function (message) {
    var that = this;
    that.__processNativeTask(message);
  },
  __processNativeTask: function (message) {
    var that = this;
    var dataObj = lodash.extend({
      task_id: '',
      commands: [],
      taskMethodWay: TaskMethodWay.Task
    }, message);

    var cbName = $bc_$15._get_callback(function (_obj) {
      console.log('-------- from native callback ---------------');
      var obj = lodash.extend({
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
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CallTaskSuccess) {
        console.log('call task success .... ');
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CancelCallTask) {
        console.log('call task cancel .... ');
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CallTaskLog) {
        console.log('call task log .... ');
        that.onReceiveMessage(msgPackage);
      } else if (obj.type === TNMT.CallTaskExit) {
        console.log('call task exit .... ');
        that.onReceiveMessage(msgPackage);
      } else {
        console.warn('Warning: obj.type == UNKNOWN');
        that.onReceiveMessage(msgPackage);
      }
    }, true);

    var taskID = dataObj.task_id;
    var commands = dataObj.commands;

    if (TaskMethodWay.Task === dataObj.taskMethodWay) {
      $bc_$15.runTaskSample(TaskMethodWay.Task, cbName, [taskID, commands]);
    } else if (TaskMethodWay.SendEvent === dataObj.taskMethodWay) {
      console.assert(lodash.isArray(commands), 'message.commands must be array.');
      var poolCommands = lodash.concat([], commands);
      console.assert(lodash.isArray(poolCommands), 'message.poolCommands must be array.');
      poolCommands.push(taskID);
      $bc_$15.runTaskSample(TaskMethodWay.SendEvent, cbName, poolCommands);
    }
  }
};

// 批量处理注册及接收方式
lodash.each(TypeMsg$4, function (eventType, key, list) {
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

var ProxyClientNativeFork = SelfClass.extend(__$p$$5);

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
  websocketForGo: ++ChancelTypeIndex,
  httpX: ++ChancelTypeIndex,
  nativeFork: ++ChancelTypeIndex
};

var Chancel = function Chancel () {};

var prototypeAccessors = { server: { configurable: true } };

Chancel.prototype.build = function build (config) {
    if ( config === void 0 ) config = {};

  config = lodash.extend({
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
  } else if (config.type === ChancelType.websocketForGo) {
    this.proxyObj = new ProxyClientWebsocketForGo();
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
  var key = lodash.uniqueId(logCord + '__chancel2HandlerHelp__');
  var that = this;
  that.mapAssObj[key] = assObj;
  that.mapAssFnc[key] = fnc;
  that.mapAssEvent[key] = assEvent;
  return fnc
};

Chancel2HandlerHelper.prototype.getThatFunctionList = function getThatFunctionList (assEvent, assObj) {
  var that = this;
  var _fnList = [];
  lodash.each(lodash.kes(that.mapAssObj), function (key) {
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
    that.log(logCord, ' _events count = ' + lodash.keys(_events).length);
  },
  // --------------------------------------------------------
  init: function () {
    var that = this;
    that.debug = true;
  },
  // --------------- 信息交互 通道建立 ------------------------
  ChancelType: ChancelType,
  Chancel: Chancel,
  __chancelList: [], // 通讯通道对象
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
    chancel.type === ChancelType.websocketForPython ||
    chancel.type === ChancelType.websocketForGo
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
    chancel.type === ChancelType.websocketForPython ||
    chancel.type === ChancelType.websocketForGo
    ) {
      lodash.each(_c2hhFn(_msgType.OnWSGetServerMessage, _cs), function (fnc) {
        _cs.unregisterOnWSGetServerMessage(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnSendMessageToServer, _cs), function (fnc) {
        _cs.unregisterOnSendMessageToServer(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnCreateError, _cs), function (fnc) {
        _cs.unregisterOnCreateError(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnWSClose, _cs), function (fnc) {
        _cs.unregisterOnWSClose(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnWSOpen, _cs), function (fnc) {
        _cs.unregisterOnWSOpen(fnc);
      });
    } else if (chancel.type === ChancelType.nativeFork) {
      lodash.each(_c2hhFn(_msgType.OnGetServerMessage, _cs), function (fnc) {
        _cs.unregisterOnGetServerMessage(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnSendMessageToServer, _cs), function (fnc) {
        _cs.unregisterOnSendMessageToServer(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnCreateError, _cs), function (fnc) {
        _cs.unregisterOnCreateError(fnc);
      });
      lodash.each(_c2hhFn(_msgType.OnRunning, _cs), function (fnc) {
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

    lodash.each(that.__chancelList, function (chancel) {
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
lodash.each(TypeMsg, function (eventType, key, list) {
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

var $bc_$17 = task;

var logCord$7 = '[SDK.Proxy.WebServer.Node]';
var __key$7 = 'proxy-sever-plugin-Node';

var TypeMsg$7 = lodash.extend({}, TypeTriggerMsg);
var TNMT$2 = TypeNativeMessageType;

// ====================================================================
// Node 插件服务器引擎
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
    var cg = that.baseConfig = lodash.extend(that.baseConfig, config);
    // const MT = that.getInternalMessageType()
    that._isStarted = true;
    that.__startNodeWebServer(cg);
  },

  __startNodeWebServer: function (cg) {
    var that = this;
    that.log(logCord$7, 'start node web server');

    var taskID = __key$7 + lodash.now();
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
        console.error(logCord$7, 'not found www file');
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
      console.warn(logCord$7, 'please run you or remote python server for process');
    }
  }
};

var ProxyServerPluginWebServerNode = SelfClass.extend(__$p$$8);

var $bc_$18 = common;

var logCord$8 = '[SDK.Proxy.WebServer.Python]';
var __key$8 = 'proxy-sever-plugin-python';

var TypeMsg$8 = {};

// ====================================================================
// python 插件服务器引擎
var __$p$$9 = {
  name: __key$8,
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
    return TypeMsg$8
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
      console.error(logCord$8, 'not found plugin config');
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
      console.warn(logCord$8, 'is started .... you can use bind message to process you data');
      return
    }
    // 整理config信息
    var cg = that.baseConfig = lodash.extend(that.baseConfig, config);
    // const MT = that.getInternalMessageType()
    that._isStarted = true;
    that.__startPyWebServer(cg);
  },

  __startPyWebServer: function (cg) {
    var that = this;
    var __agent = that;

    var taskID = __key$8 + lodash.now();
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
      console.warn(logCord$8, 'please run you or remote python server for process');
    }

    return taskID
  }
};

var ProxyServerPluginWebServerPython = SelfClass.extend(__$p$$9);

var $bc_$16 = task;

var debugBand = "\nYou are running Vue in development mode.\nMake sure to turn on production mode when deploying for production.\nSee more tips at https://github.com/LabsRS-Dev/sdk\nProxy.debug = false\n";
var logCord$6 = '[SDK.Proxy]';

var __key$6 = 'agent-sever';
var TypeMsg$6 = TypeTriggerMsg;
var TNMT$1 = TypeNativeMessageType;

/**
 * 复杂的一些处理，全部通过代理一致性封装掉，方便以后统一处理
 */
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

  // --------------------------------------------------------------
  _isStarted: false,
  baseConfig: {
    nativePlugins: [], // 跟随系统启动的插件
    fnOnPluginInit: function () {},
    fnOnExecTaskUpdateInfo: function () {},
    fnIAP: function () {}, // 内置购买配置接口
    fnMenuPreferences: '', // 用户参数化选择菜单配置接口
    dropDragConfig: { // 拖拽处理配置接口
      enable: false, // 默认是不开启的
      enableDir: false, // 是否允许拖拽文件夹
      enableFile: true, // 是否拖拽文件
      allowTypes: ['*'], // 允许拖拽的文件类型
      handler: function (data) {
        console.log(JSON.stringify(data));
      }
    },
    httpPort: '8080', // Webserver port
    enableServer: { // 哪些本地服务器插件可以同时启动
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
      console.warn(logCord$6, '[SDK.proxy] is started .... you can use bind message to process you data');
      return
    }

    that._isStarted = true;

    // 整理config信息
    var cg = that.baseConfig = lodash.extend(that.baseConfig, config);
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
          if (lodash.isFunction(cg.fnIAP)) {
            cg.fnIAP();
          }
        }
        // 3. 注册[参数选择]菜单命令回调
        if (lodash.isFunction(cg.fnMenuPreferences)) {
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
        console.error(logCord$6, error);
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
      console.error(logCord$6, error);
      that._isStarted = false;
    }
  },

  // ---------------------------------------------------------------
  // 配置内核启动成功后的处理方式
  configOnNativeEngineInitSuccessCallback: function (cb) {
    console.log(logCord$6, 'config on native engine init success!');
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
            __agent.log(logCord$6, 'init core plugin success!');
            __mc.trigger(TypeMsg$6.onNativeEngineInitSuccess, {
              data: obj
            });
          } else if (obj.type === TNMT$1.InitCoreFailed) {
            console.error(logCord$6, 'init core plugin failed!');
            __mc.trigger(TypeMsg$6.onNativeEngineInitFailed, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$6, error);
        }
      }

      // 声明处理CLI的回调处理
      function process_dylibCLI (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.CliCallStart) {
            __agent.log(logCord$6, 'start dylib cli call!');
            __mc.trigger(TypeMsg$6.onDylibCLIStart, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CliCallReportProgress) {
            __agent.log(logCord$6, 'report dylib cli call progress!');
            __mc.trigger(TypeMsg$6.onDylibCLIFeedback, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CliCallEnd) {
            __agent.log(logCord$6, 'end dylib cli call!');
            __mc.trigger(TypeMsg$6.onDylibCLIEnd, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$6, error);
        }
      }

      // 声明处理ExecCommand的方法
      function process_execCommand (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.AddExecCommandQueueSuccess) {
            __agent.log(logCord$6, 'add exec command queue success and start after!');
            var queueID = obj.queueInfo.id;
            $bc_$16.sendQueueEvent(queueID, 'execcommand', 'start');
            __mc.trigger(TypeMsg$6.onExecCommandAdded, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandStart) {
            __agent.log(logCord$6, 'exec command start ...');
            __mc.trigger(TypeMsg$6.onExecCommandStarted, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandReportProgress) {
            __agent.log(logCord$6, 'report exec command progress ...');
            __mc.trigger(TypeMsg$6.onExecCommandFeedback, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandSuccess) {
            __agent.log(logCord$6, 'exec command success ...');
            __mc.trigger(TypeMsg$6.onExecCommandSuccess, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CancelExecCommand) {
            __agent.log(logCord$6, 'exec command cancel ...');
            __mc.trigger(TypeMsg$6.onExecCommandCanceled, {
              data: obj
            });
          } else if (obj.type === TNMT$1.ExecCommandFailed) {
            __agent.log(logCord$6, 'exec command error ...');
            __mc.trigger(TypeMsg$6.onExecCommandError, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$6, error);
        }
      }

      // 声明处理Task的方法
      function process_task (obj) {
        console.assert(obj);
        try {
          if (obj.type === TNMT$1.AddCallTaskQueueSuccess) {
            __agent.log(logCord$6, 'add task queue success and start after!');
            var queueID = obj.queueInfo.id;
            $bc_$16.sendQueueEvent(queueID, 'calltask', 'start');
            __mc.trigger(TypeMsg$6.onTaskAdded, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CallTaskStart) {
            __agent.log(logCord$6, 'call task start!');
            __mc.trigger(TypeMsg$6.onTaskStarted, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CallTaskFailed) {
            __agent.log(logCord$6, 'call task error!');
            __agent.log(logCord$6, JSON.stringify(obj));
            __mc.trigger(TypeMsg$6.onTaskError, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CallTaskSuccess) {
            __agent.log(logCord$6, 'call task finished!');
            __agent.log(logCord$6, JSON.stringify(obj));
            __mc.trigger(TypeMsg$6.onTaskFinished, {
              data: obj
            });
          } else if (obj.type === TNMT$1.CancelCallTask) {
            __agent.log(logCord$6, 'call task cancel!');
            __agent.log(logCord$6, JSON.stringify(obj));
            __mc.trigger(TypeMsg$6.onTaskCanceled, {
              data: obj
            });
          }
        } catch (error) {
          console.error(logCord$6, error);
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

    console.assert(lodash.isString(cbName), 'cbName must be a string');
    return cbName
  }
};

var ProxyServer = SelfClass.extend(__$p$$7);

// -----------------------------------------------------------------------
var logCord$5 = '[SDK.agent.server]';

var __key$5 = 'agent-server';
var TypeMsg$5 = {
  OnCallActive: 'OnCallActive'
};

// ------------------------------------------------------------------------
// Class AgentServer
var __$p$$6 = {
  name: __key$5,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    var that = this;
    return that.mc
  },
  getInternalMessageType: function () {
    return TypeMsg$5
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
    console.log(logCord$5, 'You maybe known some config information');
    var svr = new ProxyServer();
    svr.start(config);
    that.mc.trigger(TypeMsg$5.OnCallActive, '');
    return that
  }
};

// 批量处理注册及接收方式
lodash.each(TypeMsg$5, function (eventType, key, list) {
  var registerKey = 'register' + key;
  var unregisterKey = 'unregister' + key;

  __$p$$6[registerKey] = function (handler, one) {
    if ( one === void 0 ) one = false;

    __$p$$6.mc.bind(eventType, handler, one);
  };
  __$p$$6[unregisterKey] = function (handler) {
    __$p$$6.mc.unbind(eventType, handler);
  };
});

var AgentServer = SelfClass.extend(__$p$$6);

// ---------------------------
// Interface outside
var $bc_ = {};
$bc_ = lodash.extend($bc_, common);
$bc_ = lodash.extend($bc_, iap);
$bc_ = lodash.extend($bc_, notice);
$bc_ = lodash.extend($bc_, app);
$bc_ = lodash.extend($bc_, xpc);
$bc_ = lodash.extend($bc_, nwindow);
$bc_ = lodash.extend($bc_, menu);
$bc_ = lodash.extend($bc_, clipboard);
$bc_ = lodash.extend($bc_, dock);
$bc_ = lodash.extend($bc_, binary);
$bc_ = lodash.extend($bc_, plugin);
$bc_ = lodash.extend($bc_, dragdrop);
$bc_ = lodash.extend($bc_, task);
$bc_ = lodash.extend($bc_, filedialog);
$bc_ = lodash.extend($bc_, { AgentClient: AgentClient });
$bc_ = lodash.extend($bc_, { AgentServer: AgentServer });

var BS = {
  version: '20171208.9.3',
  b$: $bc_
};

/** Copyright 2012 Mozilla Foundation
 * RTYUtils
 *
 */

// Object functions
// -------------------------------------------------------------------------
var logCord$9 = '[SDK.Util.common]';
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
uu$.getErrorMessage = Tool.getErrorMessage;

/**
 * 获取KendoUI 规定的时间
 */
uu$.getMyDateStr = function (format) {
  if ( format === void 0 ) format = 'yyyy/MM/dd hh:mm:ss';

  var that = this.RTYUtils;
  that.assert(that.isObject(window.kendo), 'getMyDateStr function require kendoUI library');
  if (window.kendo) {
    return window.kendo.toString((new Date()), format)
  }
  return ''
};

uu$.getBSb$ = function () {
  if (uu$.RTYUtils.isUndefinedOrNullOrFalse(BS.b$)) {
    console.warn(logCord$9, 'cannot found b$');
    return null
  }

  return BS.b$
};

/**
 * 获取Jquery的接口
 */
uu$.getJQuery$ = function () {
  var $;
  if (window) {
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
    $ = window.jQuery || window.$;
    console.assert(Tool.isObject($), 'Must be loaded jQuery library first \n');

    var setupKey = '_$CONFIG_JQUERY_AJAX_SETUP_IS_SETTING';
    if ($ && !window[setupKey]) {
      console.log('You can use $.ajaxSetup to control ajax method timeout issue. \n');
      try {
        var defaultTimeout = 30 * 1000; // apache2的默认超时时间是30秒
        $.ajaxSetup({
          timeout: defaultTimeout
        });
        window[setupKey] = true;
        console.log('$.ajaxSetup default timeout = ' + defaultTimeout);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return $
};

/**
 * 获取SnapSVG的接口
 * @see https://www.npmjs.com/package/snapsvg
 * @see http://snapsvg.io
 */
uu$.getSnapSVG$ = function () {
  if (window) {
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
    var ref = window.Snap || undefined;
    return ref
  }
  return undefined
};

/**
 * 获取Axio的接口
 * @see https://github.com/mzabriskie/axios
 * @see https://www.chenshaowen.com/blog/the-axios-ajax/
 */
uu$.getAxios$ = function () {
  if (window) {
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
    var ref = window.axios || undefined;
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
      console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
      console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
      if (window.jQuery && window.$) {
        window.$['objClone'] = t$.objClone;
        window.$['getMyDateStr'] = t$.getMyDateStr;
        window.$['getFormatDateStr'] = t$.getFormatDateStr;
        window.$['obj2string'] = t$.obj2string;
        window.$['stringFormat'] = t$.stringFormat;
        window.$['compareVersion'] = t$.compareVersion;
        window.$['testObjectType'] = t$.testObjectType;
        window.$['getErrorMessage'] = t$.getErrorMessage;
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
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');

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

uu$$1.getp = function (url, data, noCache, cb, failCallback, noCancel) {
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

    var dataInfo = {};
    try {
      if (b$.App) {
        dataInfo = lodash.extend(data, {
          'app_name': b$.App.getAppName() || 'app_name',
          'app_bundle_id': b$.App.getAppId() || 'app_id',
          'app_sandbox_enable': b$.App.getSandboxEnable() || 0,
          isRegistered: b$.App.getIsRegistered() || 0,
          os: b$.App.getAppRunOnOS() || '',
          userName: b$.App.getUserName() || '0',
          serialNumber: b$.App.getSerialNumber() || '',
          version: b$.App.getAppVersion() || '2.0'
        });
      }
    } catch (e) {
      console.error(e);
    }

    var script = url + (url.indexOf('?') === -1 ? '?' : '&') + $.param(dataInfo);
    console.log('[script] = ', script);

    $.getScript(script).done(function () {
      $.event.trigger('ajaxSend');
    }).fail(function () {
      console.warn('[Warning] [', script, '] ajax get script failed ...');
      failCallback && failCallback();
    });
  } catch (e) {
    console.error(e);
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 通用的提交信息接口
 */
uu$$1.commitMessage = function (apiUrl, messageObj, cb, failCallback) {
  if ( apiUrl === void 0 ) apiUrl = '/';
  if ( messageObj === void 0 ) messageObj = {};
  if ( cb === void 0 ) cb = function () {};
  if ( failCallback === void 0 ) failCallback = null;

  console.log('--- $.commitMessage ---');
  var t$ = this;
  var url = config.ConfigServer.getDomain() + apiUrl;
  t$.getp(url, messageObj, true, cb, failCallback || function () {
    console.warn('[Warning] [', url, '] ajax failed');
  });
};

/**
 * 向服务器提交信息,用途，与服务器上的交互，可以收集错误信息
 */
uu$$1.reportInfo = function (info, callback, failCallback) {
  console.log('--- $.reportInfo ---');
  var t$ = this;

  t$.getp(config.ConfigServer.getDomain() + '/services/report_info', { data: info || '' }, true, function (o) {
    callback && callback(o);
    console.log('get_report_feedback:' + common$1.obj2string(o));
    if (lodash.isObject(o)) {
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
  }, false, function () {
    failCallback && failCallback();
  });
};

/**
 * 封装简单报告问题的接口
 */
uu$$1.reportErrorInfo = function (e, addonInfo, callback, failCallback) {
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
  }, callback, failCallback);
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
    if (window) {
      console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
      console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');

      if (window.jQuery && window.$) {
        window.$['tmpl'] = t$.tmpl;
        window.$['flush_cache'] = t$['flush_cache'];
        window.$['setp'] = t$.setp;
        window.$['getp'] = t$.getp;

        window.$['commitMessage'] = t$.commitMessage;
        window.$['reportInfo'] = t$.reportInfo;
        window.$['reportErrorInfo'] = t$.reportErrorInfo;
        window.$['feedbackInfo'] = t$.feedbackInfo;
        window.$['feedbackInfoEx'] = t$.feedbackInfoEx;

        window.$ = window.$.extend(window.$, t$);
      }
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
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
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
          return function from(arrayLike /* mapFn, thisArg */) {
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
      console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
      console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
      if (window.jQuery && window.$) {
        window.$.RTYUtils = window.$.extend(window.$.RTYUtils, t$);
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
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
    if (window.jQuery && window.$) {
      window.$ = window.$.extend(window.$, t$);
    }
  }
}

var loadLanguage = uu$$4;
autoForJquery$4(uu$$4);

/**
 * WebHelper
 */

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
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');
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
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');

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
 * foundNewVersionCallback, 内置处理完成后，回调处理
 */
var uu$$7 = {};
uu$$7.hasUpdateChecked = false;
uu$$7.checkUpdate = function (appId, promptText, getDataCB, foundNewVersionCallback) {
  try {
    var t$ = this;
    var b$ = common$1.getBSb$();
    // var $ = common.getJQuery$()

    var _checkUpdate = function (data) {
      // 先检测是否有checkUpdate属性
      if (!data.checkUpdate) { return }

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

            if (lodash.isFunction(foundNewVersionCallback)) {
              foundNewVersionCallback(data);
            } else {
              alert(foundNewVersion);
              updateURL !== '' && b$.App.open(updateURL);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    // 尝试读取服务器配置
    if (t$.hasUpdateChecked) { return }

    var info = {
      machine: b$.App.getSerialNumber(),
      os: b$.App.getAppRunOnOS(),
      sandbox: b$.App.getSandboxEnable(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion()
    };

    // 从远程服务中获取更新信息
    console.log('#[get update info] .......');
    communication.commitMessage('/services/get_update_info', info, function (_data) {
      t$.hasUpdateChecked = true;

      var serverData = lodash.isObject(_data) ? _data : {};
      serverData = lodash.isArray(serverData) ? { 'data': serverData } : serverData;
      getDataCB && getDataCB(serverData);

      console.log('#[get update info data] .......');
      console.dir(serverData);
      _checkUpdate(serverData['data']);
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

// -----------------------------------------------
var update = uu$$7;

var b$ = common$1.getBSb$();
// 产品授权使用证书管理
var uu$$8 = {};
uu$$8.CertificateManagerOnline = {

  // 注册机器
  registerMachine: function (cb) {
    if ( cb === void 0 ) cb = function () {};

    if (!b$.App.getSerialNumber()) { return }

    var info = {
      machine: b$.App.getSerialNumber(),
      os: b$.App.getAppRunOnOS()
    };
    communication.commitMessage('/services/machine_register', info, cb);
  },

  // 验证授权证书是否有效
  validateCertificate: function (certificate, cb) {
    if ( cb === void 0 ) cb = function () {};

    if (!b$.App.getSerialNumber()) { return }

    var info = {
      machine: b$.App.getSerialNumber(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion(),
      certificate: certificate
    };
    communication.commitMessage('/services/certificate_validate', info, cb);
  },

  // 绑定授权证书
  bindCertificate: function (certificate, cb) {
    if ( cb === void 0 ) cb = function () {};

    if (!b$.App.getSerialNumber()) { return }

    var info = {
      machine: b$.App.getSerialNumber(),
      certificate: certificate
    };
    communication.commitMessage('/services/machine_certificate_bind', info, cb);
  },

  // 取消绑定授权证书
  unBindCertificate: function (certificate, cb) {
    if ( cb === void 0 ) cb = function () {};

    if (!b$.App.getSerialNumber()) { return }

    var info = {
      machine: b$.App.getSerialNumber(),
      certificate: certificate
    };
    communication.commitMessage('/services/machine_certificate_unbind', info, cb);
  },

  // 获取绑定的所有证书
  fetchCertificates: function (cb) {
    if ( cb === void 0 ) cb = function () {};

    if (!b$.App.getSerialNumber()) { return }

    var info = {
      machine: b$.App.getSerialNumber(),
      os: b$.App.getAppRunOnOS(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion()
    };
    communication.commitMessage('/services/machine_certificate_fetch', info, cb);
  }
};

// -----------------------------------------------
var certificateManager = uu$$8;

var $ = common$1.getJQuery$();
var b$$1 = common$1.getBSb$();

var uu$$9 = {};
// 证书授权初始化
uu$$9.certificateManagerInit = function () {
  var cerMgr = certificateManager.CertificateManagerOnline;

  // 自动启动授权管理注册机器
  console.log('------------- registerMachine -------------');
  cerMgr.registerMachine();

  if (b$$1.App.getSandboxEnable()) { return }

  // 自动检测当前是否已经注册，已经注册的话,
  if (b$$1.App.getIsRegistered()) {
    try {
      var regJSONString = b$$1.App.getRegInfoExJSONString();
      if (!regJSONString) { console.error('-------------[Error] sdk kernal can not get the reginfo -------------'); }

      var regInfo = JSON.parse(regJSONString);
      if (regInfo.certificate) {
        cerMgr.bindCertificate(regInfo.certificate, function () {
          console.log('------------- bindCertificate .... -------');
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
};

// 更新检测初始化
uu$$9.updateCheckInit = function () {
  setTimeout(function () {
    update.checkStartInfo();

    if (b$$1.App.getSandboxEnable() && b$$1.App.getAppRunOnOS() === 'MacOSX') {
      console.log('------------- common app starting .... -------');
    } else {
      update.checkUpdate();
      // uu$.checkPatches()
    }
  }, 36 * 1000); // 36sec
};

// 内核加入自启动部分代码
try {
  if ($) {
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!');
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!');

    $(document).ready(function () {
      console.log(
        '-------------Delayed loading method, do not reflect here-------');

      // 授权证书管理初始化
      uu$$9.certificateManagerInit();

      // 默认添加提示新版本
      uu$$9.updateCheckInit();
    });
  }
} catch (e) {
  console.error(e);
}

// -----------------------------------------------
var autoStart = uu$$9;

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
util = lodash.extend(util, compatibilityWrapper);
util = lodash.extend(util, common$1);
util = lodash.extend(util, config);
util = lodash.extend(util, webHelper);
util = lodash.extend(util, communication);
util = lodash.extend(util, googleLangIDMaps);
util = lodash.extend(util, loadLanguage);
util = lodash.extend(util, loaderWrapper);
util = lodash.extend(util, update);
util = lodash.extend(util, certificateManager);
util = lodash.extend(util, autoStart);

var util$1 = {
  version: '20171208.9.3',
  util: util
};

try {
  if (window) {
    window.BS = BS;
    window._ = lodash;
    window.Romanysoft = {
      _: lodash,
      lodash: lodash,
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

var index_esm = {
  _: lodash,
  Util: util$1,
  lodash: lodash,
  BS: BS,
  Observable: Observable,
  SelfClass: SelfClass,
  version: '20171208.9.3'
};

export default index_esm;
