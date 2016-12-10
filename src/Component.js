
import * as SimpleDom from 'simpledom.js';
import { convertToSimpleDom } from './converter';

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

        for (const event of this.eventsToSubscribe()) {
            this.store.subscribe(event, this.reactToChangeState.bind(this), this);
        }
    }


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
    }

    /**
     * Internally method which is called when an event of {@link eventsToSubscribe}
     * You can override the method if you want a specific
     * @param {string} event event received in the store.
     * @param {Object} state the new state.
     */
    reactToChangeState(event, state) {
        if (!this.mustRefresh() || !this.node) {
            return;
        }

        let convertedElement = convertToSimpleDom(this.renderComponent(), this.store);
        const oldNode = this.node;
        if (convertedElement.simpleDomEl === undefined && convertedElement.simpleDomEl === null) {
            oldNode.parentNode.removeChild(oldNode);
            return;
        }
        const newNode = SimpleDom.convertToNode(convertedElement.simpleDomEl);
        oldNode.parentNode.replaceChild(newNode, oldNode);

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
     * Return false to avoid call to render on an event.
     */
    mustRefresh() {
        return true;
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
        const result = this.render();
        if (this.eventsToSubscribe() && this.eventsToSubscribe().length > 0) {
            if (result === undefined || result === null) {
                return SimpleDom.el('div',
                    {
                        ref: node => this.nodeRefHandler(node),
                        style: {
                            width: 0,
                            height: 0
                        }
                    }
                );
            }

            let firstSimpleDomChild = result;
            while (firstSimpleDomChild && !firstSimpleDomChild.isElem) {
                firstSimpleDomChild = firstSimpleDomChild.children && firstSimpleDomChild.children[0];
            }
            firstSimpleDomChild.attrs.ref = node => this.nodeRefHandler(node);
        }
        return result;
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
