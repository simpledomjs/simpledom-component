
import { el } from './renderer';
import { convertToNode } from './converter';

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
        if (this.otherRef) {
            this.otherRef(node);
        }
    }

    /**
     * Method to call to refresh the component without the use of the store.
     * Useful for internal state with this.
     */
    refresh() {
        const componentList = [];
        const oldNode = this.node;
        this.node = null;
        let newNode = convertToNode(this.renderComponent(), this.store, componentList);
        if (newNode === undefined && newNode === null) {
            oldNode.parentNode.removeChild(oldNode);
            this.componentDidMount();
            return;
        }
        oldNode.parentNode.replaceChild(newNode, oldNode);

        componentList.forEach(component => component.componentDidMount());
    }

    /**
     * Internally method which is called when an event of {@link eventsToSubscribe}
     * You can override the method if you want a specific
     * @param {string} event event received in the store.
     * @param {Object} newState the new state.
     * @param {Object} oldState the old state.
     */
    reactToChangeState(event, newState, oldState) {
        if (!this.mustRefresh(oldState, newState) || !this.node) {
            return;
        }

        this.refresh();
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
     * @param {Object} oldState the old state.
     * @param {Object} newState the new state.
     */
    mustRefresh(oldState, newState) {
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
    renderComponent(otherRef) {
        const result = this.render();
        this.otherRef = otherRef;
        if (result === undefined || result === null) {
            return el('div',
                {
                    ref: node => this.nodeRefHandler(node),
                    style: {
                        width: 0,
                        height: 0
                    }
                }
            );
        }

        if (result.isElem) {
            let oldRef = result.attrs.ref;
            result.attrs.ref = node => {
                oldRef && oldRef(node);
                this.nodeRefHandler(node);
            };
        } else if (result.isComponent) {
            result.otherRef = node => this.nodeRefHandler(node);
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
    render() {
        return undefined;
    }

}
