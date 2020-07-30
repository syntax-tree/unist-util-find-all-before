import {Node, Parent} from 'unist'
import findAllBefore = require('unist-util-find-all-before')

const heading: Node = {
  type: 'heading',
  depth: 2,
  children: []
}

const parent: Parent = {
  type: 'root',
  children: [heading]
}

// Missing params
// $ExpectError
findAllBefore()

// $ExpectError
findAllBefore(parent)

// Find by index or node
findAllBefore(parent, 1)
findAllBefore(parent, heading)

// Invalid test type
// $ExpectError
findAllBefore(parent, 1, false)

// Valid test type
findAllBefore(parent, 1, 'paragraph')

// Invalid retrurn type
// $ExpectError
const returnsString: string = findAllBefore(parent, 1)

// Valid return type
const nodes: Node[] = findAllBefore(parent, 1)
