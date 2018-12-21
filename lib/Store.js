"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var generatedId = 1;

function generateId() {
  return generatedId++;
}
/**
 * A simple Store which receive all state changes with an event (string).
 */


var Store =
/*#__PURE__*/
function () {
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
    key: "updateState",
    value: function updateState(newState) {
      var oldState = this.state;
      this.state = _objectSpread({}, this.state, newState);

      for (var _len = arguments.length, events = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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
    key: "subscribe",
    value: function subscribe(event) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {};
      var component = arguments.length > 2 ? arguments[2] : undefined;

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
            if (!_iteratorNormalCompletion && _iterator.return != null) {
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
    key: "unsubsribe",
    value: function unsubsribe(id) {
      var _arr = Object.keys(this.subscribers);

      for (var _i = 0; _i < _arr.length; _i++) {
        var event = _arr[_i];

        if (this.subscribers[event][id]) {
          delete this.subscribers[event][id];
        }
      }
    }
    /**
     * Unsubcribe all subcribers.
     */

  }, {
    key: "unsubscribeAll",
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
    key: "unsubscribeByEventAndId",
    value: function unsubscribeByEventAndId(event, id) {
      if (this.subscribers[event][id]) {
        delete this.subscribers[event][id];
      }
    }
  }]);

  return Store;
}();

exports.Store = Store;