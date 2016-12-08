

export function convertToSimpleDom(component, store) {
    let componentList = [];
    let simpleDomEl = component;
    while (simpleDomEl !== null && simpleDomEl !== undefined && simpleDomEl.isComponent) {
        let componentInstance = new simpleDomEl.componentClass({...simpleDomEl.props}, store);
        componentList.push(componentInstance);
        simpleDomEl = componentInstance.renderComponent();
    }
    if (simpleDomEl && simpleDomEl.children) {
        const convertedChildren = simpleDomEl.children.map(child => convertToSimpleDom(child, store));
        simpleDomEl.children = convertedChildren.map(convertedChild => convertedChild.simpleDomEl);
        componentList = componentList.concat(...convertedChildren.map(convertedChild => convertedChild.componentList));
    }
    return {simpleDomEl, componentList};
}
