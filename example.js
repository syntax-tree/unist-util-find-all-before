import {u} from 'unist-builder'
import {findAllBefore} from './index.js'

const tree = u('tree', [
  u('leaf', 'leaf 1'),
  u('parent', [u('leaf', 'leaf 2'), u('leaf', 'leaf 3')]),
  u('leaf', 'leaf 4'),
  u('parent', [u('leaf', 'leaf 5')]),
  u('leaf', 'leaf 6'),
  u('empty'),
  u('leaf', 'leaf 7')
])

const leaf6 = tree.children[4]

console.log(findAllBefore(tree, leaf6, 'leaf'))
