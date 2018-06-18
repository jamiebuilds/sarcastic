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
  return is(pkg, pkgShape, 'pkg');
}

let pkg = assertPkg(require('./package.json'));
// type:
//   {
//     name: string,
//     version: string,
//     private: boolean | null,
//     scripts: { [key: string]: string } | null,
//     bin: string | Array<string> | null
//   }
```
