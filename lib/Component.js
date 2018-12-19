'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _converter = require('./converter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for a component.
 * ```
 *   class HelloWorldComponent extends Component {
 *      render() {
 *          return (
 *              <h1>{this.props.message}</h1>
 *          );
 *      }
 *   }
 *
 *   renderToDom('container', <HelloWorldComponent messsage="Hello World!"/>);
 * ```
 */
var Component = exports.Component = function () {
    _createClass(Component, [{
        key: 'state',


        /**
         * The state of the current store
         * @type {Object}
         */
        get: function get() {
            return this.store.state;
        }

        /**
         * Constructor of a component.
         * @param {Object} props the props (attributes pass to dom node + children)
         * @param {Store} store the store.
         */

    }]);

    function Component(props) {
        var _this = this;

        var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        _classCallCheck(this, Component);

        /**
         * The props  (attributes pass to dom node + children).
         * @type {Object}
         */
        this.props = props;
        /**
         * The store share between all components.
         * @type {Store}
         */
        this.store = store;

        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(function (name) {
            return name !== 'constructor';
        }).filter(function (name) {
            return _this[name] instanceof Function;
        }).forEach(function (name) {
            return _this[name] = _this[name].bind(_this);
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.eventsToSubscribe()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var event = _step.value;

                this.store.subscribe(event, this.reactToChangeState.bind(this), this);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.eventsToReact()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _event = _step2.value;

                this.store.subscribe(_event, this.react.bind(this), this);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        if (this.componentDidUnmount) {
            this.store.componentsToUnmount.push(this);
        }
    }

    /**
     * Do not touch :)
     * @param {Node} node parent node of the component.
     */


    _createClass(Component, [{
        key: 'nodeRefHandler',
        value: function nodeRefHandler(node) {
            /**
             * Parent node of the component.
             * @type {Node}
             */
            this.node = node;
            if (this.otherRef) {
                this.otherRef(node);
            }
        }

        /**
         * Method to call to refresh the component without the use of the store.
         * Useful for internal state with this.
         */

    }, {
        key: 'refresh',
        value: function refresh() {
            var componentList = [];
            var oldNode = this.node;
            this.node = null;
            var newNode = (0, _converter.convertToNode)(this.renderComponent(), this.store, componentList);
            if (newNode === undefined || newNode === null) {
                oldNode.parentNode && oldNode.parentNode.removeChild(oldNode);
                this.componentDidMount();
                return;
            }
            oldNode.parentNode && oldNode.parentNode.replaceChild(newNode, oldNode);
            this.store.refreshComponentsToObserve && this.store.refreshComponentsToObserve();

            this.componentDidMount();
            componentList.forEach(function (component) {
                return component.componentDidMount();
            });
        }

        /**
         * Internally method which is called when an event of {@link eventsToSubscribe}
         * You can override the method if you want a specific
         * @param {string} event event received in the store.
         * @param {Object} newState the new state.
         * @param {Object} oldState the old state.
         */

    }, {
        key: 'reactToChangeState',
        value: function reactToChangeState(event, newState, oldState) {
            if (!this.mustRefresh(oldState, newState) || !this.node) {
                return;
            }

            this.componentDidUnmount && this.componentDidUnmount();
            this.refresh();
            this.componentDidMount();
        }

        /**
         * Method to implement to react when an event is send to {@link Store}
         * @return {Array} array of string events to react.
         */

    }, {
        key: 'eventsToSubscribe',
        value: function eventsToSubscribe() {
            return [];
        }

        /**
         * Method to implement to react when an event that does not imply re rendering is sent to {@link Store}
         * @return {Array} array of string events to react without rendering.
         */

    }, {
        key: 'eventsToReact',
        value: function eventsToReact() {
            return [];
        }

        /**
         * Method to implement called when an event that does not imply re rendering is sent to {@link Store}
         * @param {String} event to react on
         */

    }, {
        key: 'react',
        value: function react(event) {}

        /**
         * Return false to avoid call to render on an event.
         * @param {Object} oldState the old state.
         * @param {Object} newState the new state.
         */

    }, {
        key: 'mustRefresh',
        value: function mustRefresh(oldState, newState) {
            return true;
        }

        /**
         * Method called after rendered into DOM.
         * @abstract
         */

    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}

        /**
         * Method use internally to render a component.
         * @return {Component|Object} This return a component or result of SimpleDom.el.
         */

    }, {
        key: 'renderComponent',
        value: function renderComponent(otherRef) {
            var _this2 = this;

            var result = this.render();
            this.otherRef = otherRef;
            if (result === undefined || result === null) {
                return (0, _renderer.el)('div', {
                    ref: function ref(node) {
                        return _this2.nodeRefHandler(node);
                    },
                    style: {
                        width: 0,
                        height: 0
                    }
                });
            }

            if (result.isElem) {
                var oldRef = result.attrs.ref;
                result.attrs.ref = function (node) {
                    oldRef && oldRef(node);
                    _this2.nodeRefHandler(node);
                };
            } else if (result.isComponent) {
                result.otherRef = function (node) {
                    return _this2.nodeRefHandler(node);
                };
            } else {
                console.error('Unkown result type for a component', result);
            }

            return result;
        }

        /**
         * Method to implement to render something.
         * @abstract
         * @return {Component|Object} This return a component or result of {@link el}.
         */

    }, {
        key: 'render',
        value: function render() {
            return undefined;
        }
    }]);

    return Component;
}();

Component.isComponent = true;