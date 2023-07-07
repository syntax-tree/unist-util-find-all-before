import {expectType} from 'tsd'
import type {
  Heading,
  PhrasingContent,
  Root,
  RootContent,
  RowContent,
  TableCell,
  TableRow,
  Text
} from 'mdast'
import {findAllBefore} from './index.js'

const text: Text = {type: 'text', value: 'alpha'}
const heading: Heading = {type: 'heading', depth: 1, children: [text]}
const root: Root = {type: 'root', children: [heading]}
const cell: TableCell = {type: 'tableCell', children: [text]}
const row: TableRow = {type: 'tableRow', children: [cell]}

// @ts-expect-error: parent needed.
findAllBefore()

// @ts-expect-error: child or index needed.
findAllBefore(heading)

findAllBefore(
  // @ts-expect-error: parent needed.
  text,
  0
)

expectType<PhrasingContent[]>(findAllBefore(heading, text))

expectType<Text[]>(findAllBefore(heading, text, 'text'))

expectType<Text[]>(findAllBefore(heading, 0, 'text'))

expectType<RootContent[]>(findAllBefore(root, 0))

expectType<Text[]>(findAllBefore(root, 0, 'text'))

expectType<RowContent[]>(findAllBefore(row, 0))
