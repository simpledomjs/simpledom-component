import * as SimpleDom from 'simpledom-component';

class Welcome extends SimpleDom.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

SimpleDom.renderToDom(
    'helloWorldComponent',
    <Welcome name="Luke"/>
);