'use strict';

/* eslint-env mocha */

var assert = require('assert');
var mdast = require('mdast');
var findAllBefore = require('./');

var tree = mdast.parse('Some *emphasis*, **strongness**, and `code`.');
var paragraph = tree.children[0];
var children = paragraph.children;

describe('unist-util-find-all-before', function () {
  it('should fail without parent', function () {
    assert.throws(
      function () {
        findAllBefore();
      },
      /Expected parent node/
    );
  });

  it('should fail without parent node', function () {
    assert.throws(
      function () {
        findAllBefore({type: 'foo'});
      },
      /Expected parent node/
    );
  });

  it('should fail without index', function () {
    assert.throws(
      function () {
        findAllBefore({type: 'foo', children: []});
      },
      /Expected positive finite index or child node/
    );

    assert.throws(
      function () {
        findAllBefore({type: 'foo', children: []}, -1);
      },
      /Expected positive finite index or child node/
    );

    assert.throws(
      function () {
        findAllBefore({type: 'foo', children: []}, {type: 'bar'});
      },
      /Expected positive finite index or child node/
    );
  });

  it('should fail for invalid `test`', function () {
    assert.throws(
      function () {
        findAllBefore({type: 'foo', children: [{type: 'bar'}]}, 1, false);
      },
      /Expected function, string, or node as test/
    );

    assert.throws(
      function () {
        findAllBefore({
          type: 'foo',
          children: [{type: 'bar'}]
        }, 1, true);
      },
      /Expected function, string, or node as test/
    );
  });

  it('should return the preceding nodes when without `test`', function () {
    var res = [children[0]];

    assert.deepEqual(findAllBefore(paragraph, children[1]), res);
    assert.deepEqual(findAllBefore(paragraph, 1), res);
    assert.deepEqual(findAllBefore(paragraph, 0), []);
  });

  it('should return `[node]` when given a `node` and existing', function () {
    var res = [children[0]];

    assert.deepEqual(findAllBefore(paragraph, 100, children[0]), res);
    assert.deepEqual(findAllBefore(paragraph, children[1], children[0]), res);
    assert.deepEqual(findAllBefore(paragraph, 1, children[0]), res);
    assert.deepEqual(findAllBefore(paragraph, children[0], children[0]), []);
    assert.deepEqual(findAllBefore(paragraph, 0, children[0]), []);
    assert.deepEqual(findAllBefore(paragraph, 1, children[1]), []);
  });

  it('should return children when given a `type` and existing', function () {
    var result = [children[3]];

    assert.deepEqual(findAllBefore(paragraph, 100, 'strong'), result);
    assert.deepEqual(findAllBefore(paragraph, 3, 'strong'), []);
    assert.deepEqual(findAllBefore(paragraph, children[4], 'strong'), result);
    assert.deepEqual(findAllBefore(paragraph, children[3], 'strong'), []);
  });

  it('should return children when given a `test` and existing', function () {
    var res = children.slice(4).reverse();

    assert.deepEqual(findAllBefore(paragraph, 100, test), res);
    assert.deepEqual(findAllBefore(paragraph, 3, test), []);
    assert.deepEqual(findAllBefore(paragraph, children[4], test), []);
    assert.deepEqual(findAllBefore(paragraph, children[3], test), []);

    function test(node, n) {
      return n > 3;
    }
  });
});
