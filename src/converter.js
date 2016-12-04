

export function convertToSimpleDom(component, store) {
    if (component === undefined || component === null) {
        return undefined;
    }
    let simpleDomEl = component;
    while (simpleDomEl.isComponent) {
        simpleDomEl = new simpleDomEl.componentClass({...simpleDomEl.props}, store).renderComponent();
    }
    if (simpleDomEl.children) {
        simpleDomEl.children = simpleDomEl.children.map(child => convertToSimpleDom(child, store))
    }
    return simpleDomEl;
}