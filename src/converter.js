

export function convertToSimpleDom(component, store) {
    let simpleDomEl = component;
    while (simpleDomEl !== null && simpleDomEl !== undefined && simpleDomEl.isComponent) {
        simpleDomEl = new simpleDomEl.componentClass({...simpleDomEl.props}, store).renderComponent();
    }
    if (simpleDomEl && simpleDomEl.children) {
        simpleDomEl.children = simpleDomEl.children.map(child => convertToSimpleDom(child, store))
    }
    return simpleDomEl;
}