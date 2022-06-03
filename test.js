/**
 * @typedef {import('mdast').Paragraph} Paragraph
 */

import test from 'tape'
import {remark} from 'remark'
import {findAllBefore} from './index.js'

const tree = remark().parse('Some _emphasis_, **importance**, and `code`.')
const paragraph = /** @type {Paragraph} */ (tree.children[0])
const children = paragraph.children

test('unist-util-find-all-before', (t) => {
  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllBefore()
    },
    /Expected parent node/,
    'should fail without parent'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllBefore({type: 'foo'})
    },
    /Expected parent node/,
    'should fail without parent node'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllBefore({type: 'foo', children: []})
    },
    /Expected child node or index/,
    'should fail without index (#1)'
  )

  t.throws(
    () => {
      findAllBefore({type: 'foo', children: []}, -1)
    },
    /Expected positive finite number as index/,
    'should fail without index (#2)'
  )

  t.throws(
    () => {
      findAllBefore({type: 'foo', children: []}, {type: 'bar'})
    },
    /Expected child node or index/,
    'should fail without index (#3)'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllBefore({type: 'foo', children: [{type: 'bar'}]}, 1, false)
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#1)'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllBefore({type: 'foo', children: [{type: 'bar'}]}, 1, true)
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#2)'
  )

  t.deepEqual(
    findAllBefore(paragraph, children[1]),
    [children[0]],
    'should return the preceding nodes when without `test` (#1)'
  )
  t.deepEqual(
    findAllBefore(paragraph, 1),
    [children[0]],
    'should return the preceding nodes when without `test` (#1)'
  )
  t.deepEqual(
    findAllBefore(paragraph, 0),
    [],
    'should return the preceding nodes when without `test` (#1)'
  )

  t.deepEqual(
    // @ts-expect-error: TypeScript does not understand things.
    findAllBefore(paragraph, 100, children[0]),
    [children[0]],
    'should return `[node]` when given a `node` and existing (#1)'
  )
  t.deepEqual(
    // @ts-expect-error: TypeScript does not understand things.
    findAllBefore(paragraph, children[1], children[0]),
    [children[0]],
    'should return `[node]` when given a `node` and existing (#2)'
  )
  t.deepEqual(
    // @ts-expect-error: TypeScript does not understand things.
    findAllBefore(paragraph, 1, children[0]),
    [children[0]],
    'should return `[node]` when given a `node` and existing (#3)'
  )
  t.deepEqual(
    // @ts-expect-error: TypeScript does not understand things.
    findAllBefore(paragraph, children[0], children[0]),
    [],
    'should return `[node]` when given a `node` and existing (#4)'
  )
  t.deepEqual(
    // @ts-expect-error: TypeScript does not understand things.
    findAllBefore(paragraph, 0, children[0]),
    [],
    'should return `[node]` when given a `node` and existing (#5)'
  )
  t.deepEqual(
    // @ts-expect-error: TypeScript does not understand things.
    findAllBefore(paragraph, 1, children[1]),
    [],
    'should return `[node]` when given a `node` and existing (#6)'
  )

  t.deepEqual(
    findAllBefore(paragraph, 100, 'strong'),
    [children[3]],
    'should return children when given a `type` and existing (#1)'
  )
  t.deepEqual(
    findAllBefore(paragraph, 3, 'strong'),
    [],
    'should return children when given a `type` and existing (#2)'
  )
  t.deepEqual(
    findAllBefore(paragraph, children[4], 'strong'),
    [children[3]],
    'should return children when given a `type` and existing (#3)'
  )
  t.deepEqual(
    findAllBefore(paragraph, children[3], 'strong'),
    [],
    'should return children when given a `type` and existing (#4)'
  )

  const result = children.slice(4)

  t.deepEqual(
    findAllBefore(paragraph, 100, test),
    result,
    'should return children when given a `test` and existing (#1)'
  )
  t.deepEqual(
    findAllBefore(paragraph, 3, test),
    [],
    'should return children when given a `test` and existing (#2)'
  )
  t.deepEqual(
    findAllBefore(paragraph, children[4], test),
    [],
    'should return children when given a `test` and existing (#3)'
  )
  t.deepEqual(
    findAllBefore(paragraph, children[3], test),
    [],
    'should return children when given a `test` and existing (#4)'
  )

  /**
   * @param {unknown} _
   * @param {number|null|undefined} n
   */
  function test(_, n) {
    return typeof n === 'number' && n > 3
  }

  t.end()
})
