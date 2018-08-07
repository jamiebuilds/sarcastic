// @flow
'use strict';

/*::
import type { AssertionType } from './';
*/

const test = require('ava');
const is = require('./');

test('is without name', t => {
  t.is(is(true, is.boolean), true);
  t.is(is(false, is.boolean), false);
  t.throws(() => is(42, is.boolean));
});

test('is.boolean', t => {
  t.is(is(true, is.boolean, 'true'), true);
  t.is(is(false, is.boolean, 'false'), false);
  t.throws(() => is(42, is.boolean, '42'));
});

test('is.number', t => {
  t.is(is(42, is.number, '42'), 42);
  t.is(is(NaN, is.number, 'NaN'), NaN);
  t.throws(() => is(true, is.number, 'true'));
});

test('is.string', t => {
  t.is(is('', is.string, ''), '');
  t.is(is('hi', is.string, 'hi'), 'hi');
  t.throws(() => is(true, is.string, 'true'));
});

test('is.array', t => {
  t.deepEqual(is([], is.array, '[]'), []);
  t.deepEqual(is([1, 2, 3], is.array, '[1, 2, 3]'), [1, 2, 3]);
  t.throws(() => is({}, is.array, '{}'));
});

test('is.func', t => {
  let fn = () => {};
  t.deepEqual(is(fn, is.func, 'func'), fn);
  t.throws(() => is({}, is.func, '{}'));
  t.throws(() => is(/regex/, is.func, '/regex/'));
});

test('is.object', t => {
  t.deepEqual(is({}, is.object, '{}'), {});
  t.deepEqual(is({ foo: true }, is.object, '{ foo: true }'), { foo: true });
  t.throws(() => is([], is.object, '[]'));
  t.throws(() => is(null, is.object, 'null'));
});

test('is.arrayOf', t => {
  t.deepEqual(is([], is.arrayOf(is.number), '[]'), []);
  t.deepEqual(is([1, 2, 3], is.arrayOf(is.number), '[1, 2, 3]'), [1, 2, 3]);
  t.throws(() => is({}, is.arrayOf(is.number), '{}'));
  t.throws(() => is(["hi"], is.arrayOf(is.number), '["hi"]'));
});

test('is.arrayish', t => {
  t.deepEqual(is(1, is.arrayish(is.number), '[1]'), [1]);
  t.deepEqual(is([], is.arrayish(is.number), '[]'), []);
  t.deepEqual(is([1, 2, 3], is.arrayish(is.number), '[1, 2, 3]'), [1, 2, 3]);
  t.throws(() => is("hi", is.arrayish(is.number), '"hi"'));
  t.throws(() => is({}, is.arrayish(is.number), '{}'));
  t.throws(() => is(["hi"], is.arrayish(is.number), '["hi"]'));
});

test('is.objectOf', t => {
  t.deepEqual(is({}, is.objectOf(is.boolean), '{}'), {});
  t.deepEqual(is({ foo: true }, is.objectOf(is.boolean), '{ foo: true }'), { foo: true });
  t.throws(() => is([], is.objectOf(is.boolean), '[]'));
  t.throws(() => is(null, is.objectOf(is.boolean), 'null'));
  t.throws(() => is({ foo: 42 }, is.objectOf(is.boolean), '{ foo: 42 }'));
});

test('is.shape', t => {
  t.deepEqual(is({ foo: true }, is.shape({ foo: is.boolean }), '{ foo: true }'), { foo: true })
  t.deepEqual(is({ foo: true, bar: false }, is.shape({ foo: is.boolean }), '{ foo: true, bar: false }'), { foo: true })
  t.throws(() => is([], is.shape({ foo: is.boolean }), '[]'));
  t.throws(() => is(null, is.shape({ foo: is.boolean }), 'null'));
  t.throws(() => is({ foo: 42 }, is.shape({ foo: is.boolean }), '{ foo: 42 }'));
});

test('is.maybe', t => {
  t.is(is(undefined, is.maybe(is.boolean), 'undefined'), null);
  t.is(is(null, is.maybe(is.boolean), 'null'), null);
  t.is(is(true, is.maybe(is.boolean), 'true'), true);
  t.throws(() => is(42, is.maybe(is.boolean), '42'));
});

test('is.default', t => {
  t.is(is(undefined, is.default(is.number, 42), 'undefined'), 42);
  t.is(is(null, is.default(is.number, 42), 'null'), 42);
  t.is(is(3.14, is.default(is.number, 42), '3.14'), 3.14);
  t.throws(() => is("hi", is.default(is.number, 42), '"hi"'));
});

test('is.either', t => {
  t.is(is(true, is.either(is.boolean, is.string), 'true'), true);
  t.is(is('hi', is.either(is.boolean, is.string), 'hi'), 'hi');
  t.throws(() => is(42, is.either(is.boolean, is.string), '42'));
});

test('is.literal', t => {
  t.is(is('true', is.literal('true'), 'true'), 'true');
  t.throws(() => is(42, is.literal('true'), '42'));
  /*::
  let literalAssertion = is.literal<'true'>('true');
  type LiteralType = AssertionType<typeof literalAssertion>;
  ('true': LiteralType);
  */
});

test('is.literals', t => {
  let literalsAssertion = is.literals/*::<'a'|'b'|'c'>*/([
    'a', 'b', 'c'
  ]);
  t.is(is('a', literalsAssertion, 'a'), 'a');
  t.is(is('b', literalsAssertion, 'b'), 'b');
  t.is(is('c', literalsAssertion, 'c'), 'c');
  t.throws(() => is(42, literalsAssertion, '42'));
  const c /*: 'c'*/ = 'c';
  /*::
  type UnionType = AssertionType<typeof literalsAssertion>;
  (c: UnionType);
  */
});
