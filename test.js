/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:find-all-before
 * @fileoverview Test suite for `unit-util-find-all-before`.
 */

'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var mdast = require('mdast');
var findAllBefore = require('./');

/*
 * Methods.
 */

var dequal = assert.deepEqual;

/*
 * Fixture.
 */

var ast = mdast.parse('Some *emphasis*, **strongness**, and `code`.');
var paragraph = ast.children[0];
var children = paragraph.children;

/*
 * Tests.
 */

describe('unist-util-find-all-before', function () {
    it('should fail without parent', function () {
        assert.throws(function () {
            findAllBefore();
        }, /Expected parent node/);
    });

    it('should fail without parent node', function () {
        assert.throws(function () {
            findAllBefore({
                'type': 'foo'
            });
        }, /Expected parent node/);
    });

    it('should fail without index', function () {
        assert.throws(function () {
            findAllBefore({
                'type': 'foo',
                'children': []
            });
        }, /Expected positive finite index or child node/);

        assert.throws(function () {
            findAllBefore({
                'type': 'foo',
                'children': []
            }, -1);
        }, /Expected positive finite index or child node/);

        assert.throws(function () {
            findAllBefore({
                'type': 'foo',
                'children': []
            }, {
                'type': 'bar'
            });
        }, /Expected positive finite index or child node/);
    });

    it('should fail for invalid `test`', function () {
        assert.throws(function () {
            findAllBefore({
                'type': 'foo',
                'children': [{
                    'type': 'bar'
                }]
            }, 1, false);
        }, /Expected function, string, or node as test/);

        assert.throws(function () {
            findAllBefore({
                'type': 'foo',
                'children': [{
                    'type': 'bar'
                }]
            }, 1, true);
        }, /Expected function, string, or node as test/);
    });

    it('should return the preceding nodes when without `test`', function () {
        var res = [children[0]];

        dequal(findAllBefore(paragraph, children[1]), res);
        dequal(findAllBefore(paragraph, 1), res);
        dequal(findAllBefore(paragraph, 0), []);
    });

    it('should return `[node]` when given a `node` and existing', function () {
        var res = [children[0]];

        dequal(findAllBefore(paragraph, 100, children[0]), res);
        dequal(findAllBefore(paragraph, children[1], children[0]), res);
        dequal(findAllBefore(paragraph, 1, children[0]), res);
        dequal(findAllBefore(paragraph, children[0], children[0]), []);
        dequal(findAllBefore(paragraph, 0, children[0]), []);
        dequal(findAllBefore(paragraph, 1, children[1]), []);
    });

    it('should return children when given a `type` and existing', function () {
        var result = [children[3]];

        dequal(findAllBefore(paragraph, 100, 'strong'), result);
        dequal(findAllBefore(paragraph, 3, 'strong'), []);
        dequal(findAllBefore(paragraph, children[4], 'strong'), result);
        dequal(findAllBefore(paragraph, children[3], 'strong'), []);
    });

    it('should return children when given a `test` and existing', function () {
        var res = children.slice(4).reverse();

        /** Test */
        function test(node, n) {
            return n > 3;
        }

        dequal(findAllBefore(paragraph, 100, test), res);
        dequal(findAllBefore(paragraph, 3, test), []);
        dequal(findAllBefore(paragraph, children[4], test), []);
        dequal(findAllBefore(paragraph, children[3], test), []);
    });
});
