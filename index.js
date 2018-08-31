'use strict';
// @flow

/*::
type Name = string | (...keyPath: Array<string | number>) => string;
type Assertion<T> = (val: mixed, name: Name) => T;
type AssertionMap = { [key: string]: Assertion<any> };
type ExtractAssertionType = <T>(Assertion<T>) => T;
type AssertionResultMap<T> = $ObjMap<T, ExtractAssertionType>;

export type AssertionType<A: Assertion<*>> = $Call<ExtractAssertionType, A>;
*/

class AssertionError extends Error {
  /*::
  kind: string;
  target: string;
  value: mixed;
  */

  constructor(kind/*: string */, target/*: string */, value/*: mixed */) {
    super(`${target} must be ${kind}`);
    this.kind = kind;
    this.target = target;
    this.value = value;
  }
}

function nameToStr(name/*: Name */)/*: string */ {
  if (typeof name === 'function') {
    return name();
  } else {
    return name;
  }
}

function nextName(name/*: Name */, key/*: string | number */, fmt/*: string => string */) {
  if (typeof name === 'function') {
    let safe = name;
    return (...keyPath) => safe(key, ...keyPath);
  } else {
    return fmt(name);
  }
}

let is = /*:: <T> */ (val/*: mixed */, assertion/*: Assertion<T> */, name/*: Name */ = 'value')/*: T */ => {
  return assertion(val, name);
};

let boolean /*: Assertion<boolean> */ = (val, name) => {
  if (typeof val === 'boolean') return val;
  throw new AssertionError('a boolean', nameToStr(name), val);
};

let number /*: Assertion<number> */ = (val, name) => {
  if (typeof val === 'number') return val;
  throw new AssertionError('a number', nameToStr(name), val);
};

let string /*: Assertion<string> */ = (val, name) => {
  if (typeof val === 'string') return val;
  throw new AssertionError('a string', nameToStr(name), val);
};

let regex /*: Assertion<RegExp> */ = (val, name) => {
  if (typeof val === 'object' && val instanceof RegExp) return val;
  throw new AssertionError('a regex', nameToStr(name), val);
};

let array /*: Assertion<Array<mixed>> */ = (val, name) => {
  if (Array.isArray(val)) return val;
  throw new AssertionError('an array', nameToStr(name), val);
};

let func /*: Assertion<Function> */ = (val, name) => {
  if (typeof val === 'function') return val;
  throw new AssertionError('a function', nameToStr(name), val);
};

let object /*: Assertion<{ [key: string]: mixed }> */ = (val, name) => {
  if (typeof val === 'object' && val !== null && !Array.isArray(val)) return val;
  throw new AssertionError('an object', nameToStr(name), val);
};

let arrayOf = /*:: <T> */ (assertion /*: Assertion<T> */) /*: Assertion<Array<T>> */ => {
  return (val, name) => {
    return is(val, array, name).map((item, index) => {
      return assertion(item, nextName(name, index, name => `${name}[${index}]`))
    });
  };
};

let arrayish = /*:: <T> */ (assertion /*: Assertion<T> */) /*: Assertion<Array<T>> */ => {
  let arrAssertion = is.arrayOf(assertion);
  return (val, name) => {
    if (Array.isArray(val)) {
      return arrAssertion(val, name);
    } else {
      try {
        return [assertion(val, name)];
      } catch (err) {
        if (!(err instanceof AssertionError)) throw err;
        throw new AssertionError(`${err.kind} or an array`, nameToStr(name), val);
      }
    }
  };
};

let objectOf = /*::<T> */ (assertion/*: Assertion<T>*/)/*: Assertion<{ [key: string]: T }> */ => {
  return (val, name) => {
    let obj = is(val, object, name);
    let res = {};
    Object.keys(obj).forEach(key => {
      res[key] = assertion(obj[key], nextName(name, key, name => `${name}.${key}`));
    });
    return res;
  };
};

let shape = /*:: <T: AssertionMap> */ (assertions /*: T */) /*: Assertion<AssertionResultMap<T>> */ => {
  return (val, name) => {
    let obj = is(val, object, name);
    let res = {};
    Object.keys(assertions).forEach(key => {
      res[key] = assertions[key](obj[key], nextName(name, key, name => `${name}.${key}`));
    });
    return res;
  };
};

let maybe = /*:: <T> */ (assertion /*: Assertion<T> */) /*: Assertion<T | null> */ => {
  return (val, name) => {
    if (typeof val === 'undefined' || val === null) return null;
    return assertion(val, name);
  };
};

let _default = /*:: <T> */ (assertion /*: Assertion<T> */, defaultValue /*: T */) /*: Assertion<T> */ => {
  return (val, name) => {
    if (typeof val === 'undefined' || val === null) return defaultValue;
    return assertion(val, name);
  };
};

let either = /*:: <A, B> */ (assertionA /*: Assertion<A> */, assertionB /*: Assertion<B> */) /*: Assertion<A | B> */ => {
  return (val, name) => {
    try {
      return assertionA(val, name)
    } catch (errA) {
      if (!(errA instanceof AssertionError)) throw errA;
      try {
        return assertionB(val, name);
      } catch (errB) {
        if (!(errA instanceof AssertionError)) throw errB;
        throw new AssertionError(`${errA.kind} or ${errB.kind}`, nameToStr(name), val);
      }
    }
  };
};

is.is = is;
is.boolean = boolean;
is.number = number;
is.string = string;
is.array = array;
is.func = func;
is.object = object;
is.arrayOf = arrayOf;
is.arrayish = arrayish;
is.objectOf = objectOf;
is.shape = shape;
is.maybe = maybe;
is.default = _default;
is.either = either;
is.AssertionError = AssertionError;

module.exports = is;
