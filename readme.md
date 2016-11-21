# unist-util-find-all-before [![Build Status](https://img.shields.io/travis/wooorm/unist-util-find-all-before.svg)](https://travis-ci.org/wooorm/unist-util-find-all-before) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/unist-util-find-all-before.svg)](https://codecov.io/github/wooorm/unist-util-find-all-before?branch=master)

[**Unist**](https://github.com/wooorm/unist) utility to find nodes before
another node. Useful when working with [**mdast**](https://github.com/wooorm/mdast)
or [**retext**](https://github.com/wooorm/retext).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install unist-util-find-all-before
```

**unist-util-find-all-before** is also available for
[bower](http://bower.io/#install-packages) and [duo](http://duojs.org/#getting-started),
and as an AMD, CommonJS, and globals module, [uncompressed](unist-util-find-all-before.js)
and [compressed](unist-util-find-all-before.min.js).

## Usage

```js
var mdast = require('mdast');
var findAllBefore = require('unist-util-find-all-before');
var inspect = require('unist-util-inspect');

function log(nodes) {
    console.log(nodes && inspect(nodes));
    console.log();
}

mdast.use(function () {
    return function (ast) {
        var paragraph = ast.children[0];
        var children = paragraph.children;

        log(findAllBefore(paragraph, 4));
        log(findAllBefore(paragraph, children[4]));
        log(findAllBefore(paragraph, children[4], 'emphasis'));
    };
}).process('Some _emphasis_, **strongness**, and `code`.');
```

Yields (note the order of nodes):

```text
strong[1]
└─ text: 'strongness'
text: ', '
emphasis[1]
└─ text: 'emphasis'
text: 'Some '

strong[1]
└─ text: 'strongness'
text: ', '
emphasis[1]
└─ text: 'emphasis'
text: 'Some '

emphasis[1]
└─ text: 'emphasis'
```

## API

### findAllBefore(parent, index|node\[, test])

Find the nodes before `index` (or `node`), that pass `test` (when given).

**Parameters**:

*   `parent` (`Node`) — Parent to search in;

*   `node` (`Node`)
    — [Node](https://github.com/wooorm/unist#unist-nodes) to search before;

*   `index` (`number`) — Position of child to search before;

*   `test` (`Function`, `string`, or `Node`; optional)
    — See [`is()`](https://github.com/wooorm/unist-util-is#istest-node-index-parent-context).

**Returns**: `Array.<node>?`. Child nodes of `parent` which pass `test`.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
