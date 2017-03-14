import { convertToNode } from './converter';
import { flatten, dasherize, isFunction } from './util';
import { Store } from './Store';


/**
 * JSX factory function to create an object representing a dom node. Designed to be used with a JSX transpiler.
 * @param {Object|Component|string|function} element the name of the tag, or a {@link Component}.
 * @param {Object} attrs properties of the node, a plain old JS object. Not optional, if no value, put empty object.
 * @param {Array} children the children of the node, a vararg
 * @return {Object} an object representing a dom node.
 */
export function el(element, attrs, ...children) {
    if (element && element.isComponent) {
        const props = {
            ...attrs,
            children: (flatten(children) || []).filter(child => child !== null && child !== undefined)
        };
        return {
            isComponent: true,
            componentClass: element,
            props
        };
    } else {
        if (isFunction(element)) {
            return element(attrs, ...children);
        }
        return {
            name: element,
            attrs: attrs || {},
            children: (flatten(children) || []).filter(child => child !== null && child !== undefined),
            isElem: true
        };
    }
}

function cleanAnGetNode(node) {
    let realNode = node;
    if (typeof node === 'string') {
        realNode = document.getElementById(node);
    }

    while (realNode.firstChild) {
        realNode.removeChild(realNode.firstChild);
    }
    return realNode;
}

/**
 * Render a component to the dom.
 * @param {string|Node} node the id or the node where the component must be rendered.
 * @param {Component} component the component to render.
 * @param {Store} store the store
 */
export function renderToDom(node, component, store = new Store()) {

    renderComponents(node, [component], store);
}

function renderComponents(node, components, store = new Store()) {

    const realNode = cleanAnGetNode(node);

    const componentList = [];

    flatten(components).filter(component => component !== undefined && component !== null)
        .map(component => convertToNode(component, store, componentList))
        .forEach(node => realNode.appendChild(node));

    componentList.forEach(component => component.componentDidMount());

    if (componentList.length) {
        const mutationObserver = new MutationObserver(() => {
            if (!document.body.contains(realNode)) {
                mutationObserver.disconnect();
                store.unsubscribeAll();
            }
            for (let index = store.componentsSubscribes.length - 1; index >= 0; index--) {
                const component = store.componentsSubscribes[index];
                if (component.component.node && !realNode.contains(component.component.node)) {
                    component.subscribes.forEach(({event, id}) => store.unsubscribeByEventAndId(event, id));
                    component.component.node = undefined;
                    store.componentsSubscribes.splice(index, 1);
                }
            }
        });


        mutationObserver.observe(document.body, {childList: true, subtree: true});
    }
}

/**
 * Render some elements into a string.
 * @param {Array} elements elements returned by {@link el} or primitive like string.
 * @return {string} html as a string.
 */
export function renderToString(...elements) {
    return flatten(elements).map(el => {
        if (!el.name) {
            return '' + (el.__asHtml || el);
        }
        const attributes = Object.keys(el.attrs)
            .filter(attribute => !attribute.startsWith('on') && el.attrs[attribute] !== undefined && attribute !== 'ref')
            .map(attribute => {
                const key = dasherize(attribute === 'className' ? 'class' : attribute);
                let value = el.attrs[attribute];
                if (key === 'style' && typeof value === 'object') {
                    value = Object.keys(value)
                        .map(key => '' + dasherize(key) + ':' + value[key])
                        .join(';');
                } else if (key === 'class' && typeof value === 'object') {
                    value = Object.keys(value).filter(classValue => value[classValue])
                        .map(dasherize)
                        .join(' ');
                }

                return ` ${key}="${value}"`
            })
            .join('');
        const content = renderToString(...el.children);
        return `<${el.name}${attributes}>${content}</${el.name}>`
    }).join('');
}


/**
 * Render some elements into a node.
 * @param {string|Node} node the id or the node where the component must be rendered.
 * @param {Array} elements elements returned by {@link el} or primitive like string.
 */
export function renderTo(node, ...elements) {
    renderComponents(node, elements)
}
