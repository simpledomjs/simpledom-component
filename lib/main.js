"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.predicate = predicate;
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _Component.Component;
  }
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function get() {
    return _Store.Store;
  }
});
Object.defineProperty(exports, "el", {
  enumerable: true,
  get: function get() {
    return _renderer.el;
  }
});
Object.defineProperty(exports, "renderToDom", {
  enumerable: true,
  get: function get() {
    return _renderer.renderToDom;
  }
});
Object.defineProperty(exports, "renderTo", {
  enumerable: true,
  get: function get() {
    return _renderer.renderTo;
  }
});
Object.defineProperty(exports, "renderToString", {
  enumerable: true,
  get: function get() {
    return _renderer.renderToString;
  }
});

var _Component = require("./Component");

var _Store = require("./Store");

var _renderer = require("./renderer");

var _util = require("./util");

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