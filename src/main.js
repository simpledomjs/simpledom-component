import { Component } from './Component';
import { Store } from './Store';
import { el, renderToDom, renderTo, renderToString } from './renderer';
import { isFunction } from  './util';

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
export function predicate(cond, element, elseElement) {
    const isTrue = isFunction(cond) ? cond() : cond;
    if (isTrue) {
        return isFunction(element) ? element() : element;
    }
    return isFunction(elseElement) ? elseElement() : elseElement;
}

exports.Component = Component;
exports.Store = Store;
exports.el = el;
exports.renderToDom = renderToDom;
exports.renderTo = renderTo;
exports.renderToString = renderToString;
