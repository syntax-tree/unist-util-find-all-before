/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */

import {convert} from 'unist-util-is'

/**
 * Find the nodes in `parent` before another `node` or before an index,
 * that pass `test`.

 * @param parent
 *   Parent node.
 * @param index
 *   Child of `parent` or it’s index.
 * @param test
 *   `unist-util-is`-compatible test.
 * @returns
 *   Children of `parent` that pass `test`.
 */
export const findAllBefore =
  /**
   * @type {(
   *  (<T extends Node>(node: Parent, index: Node | number, test: import('unist-util-is').PredicateTest<T>) => Array<T>) &
   *  ((node: Parent, index: Node | number, test?: Test) => Array<Node>)
   * )}
   */
  (
    /**
     * @param {Parent} parent
     * @param {Node | number} index
     * @param {Test} [test]
     * @returns {Array<Node>}
     */
    function (parent, index, test) {
      const is = convert(test)
      /** @type {Array<Node>} */
      const results = []
      let offset = -1

      if (!parent || !parent.type || !parent.children) {
        throw new Error('Expected parent node')
      }

      if (typeof index === 'number') {
        if (index < 0 || index === Number.POSITIVE_INFINITY) {
          throw new Error('Expected positive finite number as index')
        }
      } else {
        index = parent.children.indexOf(index)

        if (index < 0) {
          throw new Error('Expected child node or index')
        }
      }

      // Performance.
      if (index > parent.children.length) {
        index = parent.children.length
      }

      while (++offset < index) {
        if (is(parent.children[offset], offset, parent)) {
          results.push(parent.children[offset])
        }
      }

      return results
    }
  )
