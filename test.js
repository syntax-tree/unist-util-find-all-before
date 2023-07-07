/**
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('unist').Node} UnistNode
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {findAllBefore} from 'unist-util-find-all-before'

test('findAllBefore', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('unist-util-find-all-before')).sort(),
      ['findAllBefore']
    )
  })

  const tree = fromMarkdown('Some *emphasis*, **importance**, and `code`.')

  assert(tree.type === 'root')
  const paragraph = tree.children[0]
  assert(paragraph.type === 'paragraph')
  const head = paragraph.children[0]
  assert(head.type === 'text')
  const next = paragraph.children[1]
  assert(next.type === 'emphasis')

  /** @type {Emphasis} */
  const emphasis = {type: 'emphasis', children: []}
  /** @type {InlineCode} */
  const inlineCode = {type: 'inlineCode', value: 'a'}

  await t.test('should fail without parent', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findAllBefore()
    }, /Expected parent node/)
  })

  await t.test('should fail without parent node', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findAllBefore(inlineCode)
    }, /Expected parent node/)
  })

  await t.test('should fail without index (#1)', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findAllBefore(emphasis)
    }, /Expected child node or index/)
  })

  await t.test('should fail without index (#2)', async function () {
    assert.throws(function () {
      findAllBefore(emphasis, -1)
    }, /Expected positive finite number as index/)
  })

  await t.test('should fail without index (#3)', async function () {
    assert.throws(function () {
      findAllBefore(emphasis, inlineCode)
    }, /Expected child node or index/)
  })

  await t.test('should fail for invalid `test` (#1)', async function () {
    assert.throws(function () {
      findAllBefore(
        emphasis,
        1,
        // @ts-expect-error: check that an error is thrown at runtime.
        false
      )
    }, /Expected function, string, or object as test/)
  })

  await t.test('should fail for invalid `test` (#2)', async function () {
    assert.throws(function () {
      findAllBefore(
        emphasis,
        1,
        // @ts-expect-error: check that an error is thrown at runtime.
        true
      )
    }, /Expected function, string, or object as test/)
  })

  await t.test(
    'should return the preceding nodes when without `test` (#1)',
    async function () {
      assert.deepEqual(findAllBefore(paragraph, paragraph.children[1]), [
        paragraph.children[0]
      ])
    }
  )

  await t.test(
    'should return the preceding nodes when without `test` (#1)',
    async function () {
      assert.deepEqual(findAllBefore(paragraph, 1), [paragraph.children[0]])
    }
  )

  await t.test(
    'should return the preceding nodes when without `test` (#1)',
    async function () {
      assert.deepEqual(findAllBefore(paragraph, 0), [])
    }
  )

  await t.test(
    'should return `[node]` when given a `node` and existing (#1)',
    async function () {
      const head = paragraph.children[0]
      assert(head.type === 'text')
      assert.deepEqual(findAllBefore(paragraph, 100, head), [head])
    }
  )

  await t.test(
    'should return `[node]` when given a `node` and existing (#2)',
    async function () {
      const head = paragraph.children[0]
      assert(head.type === 'text')
      assert.deepEqual(findAllBefore(paragraph, paragraph.children[1], head), [
        head
      ])
    }
  )

  await t.test(
    'should return `[node]` when given a `node` and existing (#3)',
    async function () {
      const head = paragraph.children[0]
      assert(head.type === 'text')
      assert.deepEqual(findAllBefore(paragraph, 1, head), [head])
    }
  )

  await t.test(
    'should return `[node]` when given a `node` and existing (#4)',
    async function () {
      const head = paragraph.children[0]
      assert(head.type === 'text')
      assert.deepEqual(findAllBefore(paragraph, head, head), [])
    }
  )

  await t.test(
    'should return `[node]` when given a `node` and existing (#5)',
    async function () {
      const head = paragraph.children[0]
      assert(head.type === 'text')
      assert.deepEqual(findAllBefore(paragraph, 0, head), [])
    }
  )

  await t.test(
    'should return `[node]` when given a `node` and existing (#6)',
    async function () {
      const child = paragraph.children[1]
      assert(child.type === 'emphasis')
      assert.deepEqual(findAllBefore(paragraph, 1, child), [])
    }
  )

  await t.test(
    'should return children when given a `type` and existing (#1)',
    async function () {
      assert.deepEqual(findAllBefore(paragraph, 100, 'strong'), [
        paragraph.children[3]
      ])
    }
  )

  await t.test(
    'should return children when given a `type` and existing (#2)',
    async function () {
      assert.deepEqual(findAllBefore(paragraph, 3, 'strong'), [])
    }
  )

  await t.test(
    'should return children when given a `type` and existing (#3)',
    async function () {
      assert.deepEqual(
        findAllBefore(paragraph, paragraph.children[4], 'strong'),
        [paragraph.children[3]]
      )
    }
  )

  await t.test(
    'should return children when given a `type` and existing (#4)',
    async function () {
      assert.deepEqual(
        findAllBefore(paragraph, paragraph.children[3], 'strong'),
        []
      )
    }
  )

  await t.test(
    'should return children when given a `test` and existing (#1)',
    async function () {
      const result = paragraph.children.slice(4)

      assert.deepEqual(findAllBefore(paragraph, 100, check), result)
    }
  )

  await t.test(
    'should return children when given a `test` and existing (#2)',
    async function () {
      assert.deepEqual(findAllBefore(paragraph, 3, check), [])
    }
  )

  await t.test(
    'should return children when given a `test` and existing (#3)',
    async function () {
      assert.deepEqual(
        findAllBefore(paragraph, paragraph.children[4], check),
        []
      )
    }
  )

  await t.test(
    'should return children when given a `test` and existing (#4)',
    async function () {
      assert.deepEqual(
        findAllBefore(paragraph, paragraph.children[3], check),
        []
      )
    }
  )
})

/**
 * @param {unknown} _
 * @param {number | null | undefined} n
 */
function check(_, n) {
  return typeof n === 'number' && n > 3
}
