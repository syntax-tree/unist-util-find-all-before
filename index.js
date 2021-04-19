import {convert} from 'unist-util-is'

export function findAllBefore(parent, index, test) {
  var is = convert(test)
  var results = []
  var offset = -1

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
