

export function convertToSimpleDom(component, store) {
    let simpleDomEl = component;
    while (simpleDomEl && simpleDomEl.isComponent) {
        simpleDomEl = new simpleDomEl.componentClass({...simpleDomEl.props}, store).renderComponent();
    }
    if (simpleDomEl && simpleDomEl.children) {
        simpleDomEl.children = simpleDomEl.children.map(child => convertToSimpleDom(child, store))
    }
    return simpleDomEl;
}