import * as SimpleDom from 'simpledom.js';
import { convertToSimpleDom } from './converter';
import { flatten } from './util';
import { Store } from './Store';

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

export function renderToDom(container, component, store = new Store()) {
    SimpleDom.renderTo(container, convertToSimpleDom(component, store));
}