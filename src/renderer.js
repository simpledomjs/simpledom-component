import * as SimpleDom from 'simpledom.js';
import { convertToSimpleDom } from './converter';
import { flatten } from './util';
import { Store } from './Store';


/**
 * JSX factory function to create an object representing a dom node. Designed to be used with a JSX transpiler.
 * @param {Object|Component|string} el the name of the tag, or a {@link Component}.
 * @param {Object} attrs properties of the node, a plain old JS object. Not optional, if no value, put empty object.
 * @param {Array} children the children of the node, a vararg
 * @return {Object} an object representing a dom node.
 */
export function el(el, attrs, ...children) {
    if (el && el.isComponent) {
        const props = {
            ...attrs,
            children: (flatten(children) || []).filter(child => child !== null && child !== undefined)
        };
        return {
            isComponent: true,
            componentClass: el,
            props
        };
    } else {
        return SimpleDom.el(el, attrs, ...children);
    }
}

/**
 * Render a component to the dom.
 * @param {string|Node} container the id or the node where the component must be rendered.
 * @param {Component} component the component to render.
 * @param {Store} store the store
 */
export function renderToDom(container, component, store = new Store()) {
    let convertedElements = convertToSimpleDom(component, store);
    SimpleDom.renderTo(container, convertedElements.simpleDomEl);
    convertedElements.componentList.forEach(component => component.componentDidMount());


    let rootNode = container;
    if (typeof rootNode === 'string') {
        rootNode = document.getElementById(container);
    }

    const mutationObserver = new MutationObserver(mutations => {
        if (!document.body.contains(rootNode)) {
            mutationObserver.disconnect();
            store.unsubscribeAll();
        }
        for (let index = store.componentsSubscribes.length - 1; index >= 0; index--) {
            const component = store.componentsSubscribes[index];
            if (component.component.node && !rootNode.contains(component.component.node)) {
                component.subscribes.forEach(({event, id}) => store.unsubscribeByEventAndId(event, id));
                component.component.node = undefined;
                store.componentsSubscribes.splice(index, 1);
            }
        }
    });


    mutationObserver.observe(document.body, {childList: true, subtree: true});

}