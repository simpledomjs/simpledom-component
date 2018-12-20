'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var generatedId = 1;

function generateId() {
    return generatedId++;
}

/**
 * A simple Store which receive all state changes with an event (string).
 */

var Store = exports.Store = function () {
    /**
     * The constructor.
     * @param {object} initialeState the initial state.
     */
    function Store() {
        var initialeState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Store);

        /**
         * The state of store.
         * @type {object}
         */
        this.state = initialeState;
        /**
         * Don't touch :)
         * @type {Object}
         */
        this.subscribers = {};

        /**
         * Don't touch :)
         * @type {Array}
         */
        this.componentsSubscribes = [];

        /**
         * Don't touch :)
         * @type {Array}
         */
        this.componentsToUnmount = [];
    }

    /**
     * Method to call to change the state.
     * @param {object} newState the new state (you can put only attributes changed).
     * @param {...string} events events to the origin of the state change.
     */


    _createClass(Store, [{
        key: 'updateState',
        value: function updateState(newState) {
            var oldState = this.state;
            this.state = _extends({}, this.state, newState);

            for (var _len = arguments.length, events = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                events[_key - 1] = arguments[_key];
            }

            var sourceEvent = events.length === 1 ? events[0] : events;

            var eventsToPropagate = events.concat('*');

            var index = eventsToPropagate.length;
            while (index--) {
                var event = eventsToPropagate[index];
                if (this.subscribers[event]) {
                    for (var id in this.subscribers[event]) {
                        if (this.subscribers[event].hasOwnProperty(id)) {
                            this.subscribers[event][id](event === '*' ? sourceEvent : event, this.state, oldState);
                        }
                    }
                }
            }
        }

        /**
         * Method to call to subscribe to an event.
         *
         * There is a special event that catches all events : '*'.
         *
         * @param {string} event event to subscribe.
         * @param {function(event: string, state: object, oldState:object)} callback the callback called when receive the event.
         * @param {Component} component use internally to unsubcribe component when node disappear
         * @return {number} the id to put in param of {@link unsubscribe} to unsubscribe.
         */

    }, {
        key: 'subscribe',
        value: function subscribe(event) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {};
            var component = arguments[2];

            if (!this.subscribers[event]) {
                this.subscribers[event] = {};
            }
            var id = generateId();
            this.subscribers[event][id] = callback;

            if (component) {
                var componentWrapper = undefined;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.componentsSubscribes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var componentAlreadySubcribes = _step.value;

                        if (componentAlreadySubcribes.component === component) {
                            componentWrapper = componentAlreadySubcribes;
                            break;
                        }
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

                if (!componentWrapper) {
                    componentWrapper = {
                        component: component,
                        subscribes: []
                    };
                    this.componentsSubscribes.push(componentWrapper);
                }
                componentWrapper.subscribes.push({
                    event: event,
                    id: id
                });
            }

            return id;
        }

        /**
         * Unsubscribe.
         * @param {number} id id received at {@link subscribe}
         */

    }, {
        key: 'unsubsribe',
        value: function unsubsribe(id) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.keys(this.subscribers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var event = _step2.value;

                    if (this.subscribers[event][id]) {
                        delete this.subscribers[event][id];
                    }
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
        }

        /**
         * Unsubcribe all subcribers.
         */

    }, {
        key: 'unsubscribeAll',
        value: function unsubscribeAll() {
            this.subscribers = {};
            this.componentsSubscribes = [];
            this.componentsToUnmount.forEach(function (component) {
                return component.componentDidUnmount();
            });
            this.componentsToUnmount = [];
        }

        /**
         * Unsubscribe.
         * @param {string} event event sent to {@link subscribe}
         * @param {number} id id received at {@link subscribe}
         */

    }, {
        key: 'unsubscribeByEventAndId',
        value: function unsubscribeByEventAndId(event, id) {
            if (this.subscribers[event][id]) {
                delete this.subscribers[event][id];
            }
        }
    }]);

    return Store;
}();