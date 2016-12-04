
const Component = SimpleDom.Component;
const ConnectedComponent = SimpleDom.ConnectedComponent;
const Store = SimpleDom.Store;


const colors = ['red', 'green', 'blue'];
let currentColor = 0;

class HelloMessage extends Component {
    render() {
        return <h4 style="color: white">{this.props.message}</h4>
    }
}

function nextColor() {
    return colors[(++currentColor)%3]
}

class Counter extends ConnectedComponent {
    eventsToSubscribe() {
        return ['INCREMENT_COUNTER'];
    }

    render() {
        return (
            <div>
                <span style="color: white">{this.props.store.state.counter}</span>
                <button onClick={() =>
                    this.props.store.sendState('INCREMENT_COUNTER', {counter: this.props.store.state.counter+1})
                }>+1</button>
            </div>
        );
    }
}

class HelloWorldContent extends Component {
    render() {
        return (
            <ColorContainer>
                <HelloMessage message="Hello world!"/>
                <button onClick={() => this.props.store.sendState('CHANGE_COLOR', {color: nextColor()})}>Change color</button>
                <Counter />
            </ColorContainer>
        );
    }
}

class ColorContainer extends ConnectedComponent {
    eventsToSubscribe() {
        return ['CHANGE_COLOR'];
    }

    render() {
        return (
            <div style={{backgroundColor:this.props.store.state.color}}>
                {this.props.children}
            </div>
        );
    }
}

const store = new Store({
    color: colors[currentColor],
    counter: 0
});

SimpleDom.renderToDom('simple', <HelloWorldContent />, store);
