import * as SimpleDom from 'simpledom-component';

class Counter extends SimpleDom.ConnectedComponent {
    eventsToSubscribe() {
        return ['UPDATE_COUNTER'];
    }

    render() {
        return (
            <div>
                <h1>{this.state.counter}</h1>
            </div>
        );
    }
}

class CounterButtons extends SimpleDom.Component {
    increment() {
        this.store.sendState('UPDATE_COUNTER', {counter: this.state.counter + 1});
    }
    decrement() {
        this.store.sendState('UPDATE_COUNTER', {counter: this.state.counter - 1});
    }

    render() {
        return (
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default" onClick={this.decrement}>-1</button>
                <button type="button" class="btn btn-default" onClick={this.increment}>+1</button>
            </div>
        );
    }
}

class App extends SimpleDom.Component {
    render() {
        return (
            <div>
                <Counter />
                <CounterButtons />
            </div>
        );
    }
}

const store = new SimpleDom.Store({
    counter: 0
});

SimpleDom.renderToDom('counter', <App/>, store);