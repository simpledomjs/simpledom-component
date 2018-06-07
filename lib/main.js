'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.predicate = predicate;

var _Component = require('./Component');

var _Store = require('./Store');

var _renderer = require('./renderer');

var _util = require('./util');

/**
 * Can be used as a simple if/else statement info your jsx :
 * ```
 *  SimpleDom.renderTo('container',
 *      <div>
 *          SimpleDom.predicate(myCondition,
 *              <h1>myCondition is true</h1>,
 *              <h1>myCondition is false</h1>
 *          )
 *      </div>
 *  );
 * ```
 * @param {boolean|function():boolean} cond condition to evaluate
 * @param {*} element element to return if cond is true (if it's a function, the result of the function is returned).
 * @param {*} elseElement element to return if cond is false (if it's a function, the result of the function is returned).
 * @return {*} element or elseElement depending of cond value.
 */
function predicate(cond, element, elseElement) {
    var isTrue = (0, _util.isFunction)(cond) ? cond() : cond;
    if (isTrue) {
        return (0, _util.isFunction)(element) ? element() : element;
    }
    return (0, _util.isFunction)(elseElement) ? elseElement() : elseElement;
}

exports.Component = _Component.Component;
exports.Store = _Store.Store;
exports.el = _renderer.el;
exports.renderToDom = _renderer.renderToDom;
exports.renderTo = _renderer.renderTo;
exports.renderToString = _renderer.renderToString;