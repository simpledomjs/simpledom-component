
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

    get state() {
        return this.store.state;
    }

    constructor(props, store = undefined) {
        this.props = props;
        this.store = store;

        Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(name => name !== 'constructor')
            .filter(name => this[name] instanceof Function)
            .forEach(name => this[name] = this[name].bind(this));
    }

    renderComponent() {
        return this.render();
    }

    render() {
        return undefined;
    }

}

export class ConnectedComponent extends Component {


    nodeRefHandler(node) {
        this.node = node;
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

    reactToChangeState(event, state) {
        SimpleDom.renderTo(this.node,
            convertToSimpleDom(this.render(), this.store)
        );
    }

    eventsToSubscribe() {
        return [];
    }

    renderComponent() {
        return (
            <div ref={node => this.nodeRefHandler(node)}>
                {this.render()}
            </div>
        );
    }

}
