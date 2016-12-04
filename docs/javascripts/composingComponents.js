import * as SimpleDom from 'simpledom-component';

class Welcome extends SimpleDom.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

class App extends SimpleDom.Component {
    render() {
        return (
            <div>
                <Welcome name="Luke"/>
                <Welcome name="Darth"/>
                <Welcome name="Obiwan"/>
            </div>
        );
    }
}

SimpleDom.renderToDom(
    'composingComponents',
    <App />
);