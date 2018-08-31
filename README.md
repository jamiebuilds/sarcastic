# Sarcastic

> Cast unknown values to typed values

- Asserts that a value matches the defined type
- Returns a typed value
- Copies the value for type safety

## Install

```sh
yarn add sarcastic
```

## Usage

```js
const is = require('sarcastic');

const PKG_SHAPE = is.shape({
  name: is.string,
  version: is.string,
  private: is.default(is.boolean, false),
  scripts: is.maybe(is.objectOf(is.string)),
  bin: is.maybe(is.either(is.string, is.arrayOf(is.string))),
});

let pkg = is(require('./package.json'), PKG_SHAPE);
// {
//   name: "sarcastic",
//   version: "1.0.0",
//   private: false,
//   scripts: { "test": "ava" },
//   bin: null
// }
```

**With strict typing:**

```js
import is, { type AssertionType } from 'sarcastic';

const PKG_SHAPE = is.shape({
  name: is.string,
  version: is.string,
  private: is.maybe(is.boolean),
  scripts: is.maybe(is.objectOf(is.string)),
  bin: is.maybe(is.either(is.string, is.arrayOf(is.string))),
});

type PkgShape = AssertionType<typeof PKG_SHAPE>;

function assertPkg(pkg: mixed): PkgShape {
  return is(pkg, PKG_SHAPE, 'pkg');
}

let pkg = assertPkg(require('./package.json'));
```

## API

### `is(val, assertion, name?)`

```js
is(true, is.boolean);
```

You can optionally pass a name for the value so that errors are more
descriptive:

```js
is(deepObj, deepShape, 'example');
// example.pathTo.nestedKeys.withIndexesLike[14]
```

Alternatively you can pass a formatter as the name which will receive the path
to the error as strings for keys and numbers for indexes:

```js
is(deepObj, deepShape, (...keyPath) => ['example', ...keyPath].join(' > '));
// example > pathTo > nestedKeys > withIndexesLike > 14
```

### `is.boolean`

```js
is(true, is.boolean); // returns true
is(false, is.boolean); // returns false
is(42, is.boolean); // throws instanceof is.AssertionError
```

### `is.number`

```js
is(42, is.number); // returns 42
is(NaN, is.number); // returns NaN
is(true, is.number); // throws instanceof is.AssertionError
```

### `is.string`

```js
is("", is.string); // returns ""
is("hi", is.string); // returns "hi"
is(true, is.string); // throws instanceof is.AssertionError
```

### `is.array`

```js
is([], is.array); // returns []
is([1, 2, 3], is.array); // returns [1, 2, 3]
is({}, is.array); // throws instanceof is.AssertionError
```

### `is.func`

```js
is(() => {}, is.func); // returns () => {}
is({}, is.func); // throws instanceof is.AssertionError
is(/regex/, is.func); // throws instanceof is.AssertionError
```

### `is.object`

```js
is({}, is.object); // returns {}
is({ foo: true }, is.object); // returns { foo: true }
is([], is.object); // throws instanceof is.AssertionError
is(null, is.object); // throws instanceof is.AssertionError
```

### `is.arrayOf(assertion)`

```js
is([], is.arrayOf(is.number)); // returns []
is([1, 2, 3], is.arrayOf(is.number)); // returns [1, 2, 3]
is({}, is.arrayOf(is.number)); // throws instanceof is.AssertionError
is(["hi"], is.arrayOf(is.number)); // throws instanceof is.AssertionError
```

### `is.arrayish(assertion)`

```js
is(1, is.arrayish(is.number)); // returns [1]
is([], is.arrayish(is.number)); // returns []
is([1, 2, 3], is.arrayish(is.number)); // returns [1, 2, 3]
is("hi", is.arrayish(is.number)); // throws instanceof is.AssertionError
is({}, is.arrayish(is.number)); // throws instanceof is.AssertionError
is(["hi"], is.arrayish(is.number)); // throws instanceof is.AssertionError
```

### `is.objectOf(assertion)`

```js
is({}, is.objectOf(is.boolean)); // returns {}
is({ foo: true }, is.objectOf(is.boolean)); // returns { foo: true }
is([], is.objectOf(is.boolean)); // throws instanceof is.AssertionError
is(null, is.objectOf(is.boolean)); // throws instanceof is.AssertionError
is({ foo: 42 }, is.objectOf(is.boolean)); // throws instanceof is.AssertionError
```

### `is.shape({ [key: string]: assertion })`

```js
let myShape = is.shape({ foo: is.boolean });

is({ foo: true }, myShape); // returns { foo: true
is({ foo: true, bar: false }, myShape); // returns { foo: true }
is([], myShape); // throws instanceof is.AssertionError
is(null, myShape); // throws instanceof is.AssertionError
is({ foo: 42 }, myShape); // throws instanceof is.AssertionError
```

### `is.maybe(assertion)`

```js
is(undefined, is.maybe(is.boolean)); // returns null
is(null, is.maybe(is.boolean)); // returns null
is(true, is.maybe(is.boolean)); // returns true
is(42, is.maybe(is.boolean)); // throws instanceof is.AssertionError
```

### `is.default(assertion, defaultValue)`

```js
is(undefined, is.default(is.number, 42)); // returns 42
is(null, is.default(is.number, 42)); // returns 42
is(3.14, is.default(is.number, 42)); // returns 3.14
is("hi", is.default(is.number, 42)); // throws instanceof is.AssertionError
```

### `is.either(assertionA, assertionB)`

```js
is(true, is.either(is.boolean, is.string)); // returns true
is("hi", is.either(is.boolean, is.string)); // returns "hi"
is(42, is.either(is.boolean, is.string)); // throws instanceof is.AssertionError
```

### `is.AssertionError`

```js
try {
  is(true, is.number);
} catch (err) {
  if (err instanceof is.AssertionError) {
    // an assertion error
  } else {
    // some other unexpected error
  }
}
```
