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
const pkg = require('./package.json');

let pkgShape = is.shape({
  name: is.string,
  version: is.string,
  private: is.maybe(is.boolean),
  scripts: is.maybe(is.objectOf(is.string)),
  bin: is.maybe(is.either(is.string, is.arrayOf(is.string))),
});

let safePkg = is.pkg(pkg, pkgShape, 'pkg');
// type:
//   {
//     name: string,
//     version: string,
//     private: boolean | null,
//     scripts: { [key: string]: string } | null,
//     bin: string | Array<string> | null
//   }
```
