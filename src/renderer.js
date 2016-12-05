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
    SimpleDom.renderTo(container, convertToSimpleDom(component, store));
}