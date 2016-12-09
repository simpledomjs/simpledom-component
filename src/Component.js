
import * as SimpleDom from 'simpledom.js';
import { convertToSimpleDom } from './converter';
import { flatten } from './util';

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
export class Component {
    static isComponent = true;

    /**
     * The state of the current store
     * @type {Object}
     */
    get state() {
        return this.store.state;
    }

    /**
     * Constructor of a component.
     * @param {Object} props the props (attributes pass to dom node + children)
     * @param {Store} store the store.
     */
    constructor(props, store = undefined) {
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

        Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(name => name !== 'constructor')
            .filter(name => this[name] instanceof Function)
            .forEach(name => this[name] = this[name].bind(this));
    }

    /**
     * Method called after rendered into DOM.
     * @abstract
     */
    componentDidMount() {
    }

    /**
     * Method use internally to render a component.
     * @return {Component|Object} This return a component or result of SimpleDom.el.
     */
    renderComponent() {
        return this.render();
    }

    /**
     * Method to implement to render something.
     * @abstract
     * @return {Component|Object} This return a component or result of SimpleDom.el.
     */
    render() {
        return undefined;
    }

}

/**
 * Class for a component which react to store events.
 *
 *
 * ```
 *   class Counter extends ConnectedComponent {
 *      eventsToSubscribe() {
 *          return [ 'UPDATE_COUNTER' ];
 *      }
 *
 *      render() {
 *          return (
 *              <h1>{this.state.counter}</h1>
 *          );
 *      }
 *   }
 *
 *   renderToDom('container', <Counter />);
 * ```
 *
 * @extends {Component}
 */
export class ConnectedComponent extends Component {

    /**
     * Do not touch :)
     * @param {Node} node parent node of the component.
     */
    nodeRefHandler(node) {
        /**
         * Parent node of the component.
         * @type {Node}
         */
        this.node = node;
        /**
         * Do not touch :)
         * @type {Array}
         */
        this.subscribersId = [];
        for (const event of this.eventsToSubscribe()) {
            this.subscribersId.push(this.store.subscribe(event, this.reactToChangeState.bind(this)));
        }


        const mutationObserver = new MutationObserver(mutations => {
            if (flatten(mutations.map(mutation => Array.from(mutation.removedNodes)))
                .findIndex(removedNode => removedNode.contains(this.node)) !== -1) {
                mutationObserver.disconnect();
                for (const subscriberId of this.subscribersId) {
                    this.store.unsubsribe(subscriberId);
                }
            }
        });

        mutationObserver.observe(document.body, {childList: true, subtree: true});
    }

    /**
     * Return false to avoid call to render on an event.
     */
    mustRefresh() {
        return true;
    }

    /**
     * Internally method which is called when an event of {@link eventsToSubscribe}
     * You can override the method if you want a specific
     * @param {string} event event received in the store.
     * @param {Object} state the new state.
     */
    reactToChangeState(event, state) {
        if (!this.mustRefresh()) {
            return;
        }
        let convertedElement = convertToSimpleDom(this.render(), this.store);
        const oldNode = this.node;
        this.node = SimpleDom.convertToNode(this.wrapperNode());
        SimpleDom.renderTo(this.node,
            convertedElement.simpleDomEl
        );
        oldNode.parentNode.replaceChild(this.node, oldNode);

        convertedElement.componentList.forEach(component => component.componentDidMount());
        this.componentDidMount();
    }

    /**
     * Method to implement to react when an event is send to {@link Store}
     * @return {Array} array of string events to react.
     */
    eventsToSubscribe() {
        return [];
    }

    /**
     * Method use internally to render a component.
     * @return {Component|Object} This return a component or result of SimpleDom.el.
     */
    renderComponent() {
        const wrapper = this.wrapperNode();
        wrapper.attrs.ref = node => this.nodeRefHandler(node);
        wrapper.children = flatten([this.render()]);
        return wrapper;
    }

    /**
     * Node wrapping render
     * Default is ```<div/```
     * @abstract
     * @return {Object} simpledom.el result.
     */
    wrapperNode() {
        return <div/>;
    }

}
