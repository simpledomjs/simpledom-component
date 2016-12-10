import * as SimpleDom from 'simpledom-component';

class Clock extends SimpleDom.Component {
    eventsToSubscribe() {
        return ['UPDATE_CLOCK'];
    }

    render() {
        return <p style={{color: new Date().getSeconds()%2 ? 'red' : 'black'}}>
                <h1>Hello, world!</h1>
                <h2>It is {new Date().toLocaleTimeString()}.</h2>
        </p>;
    }

}

const store = new SimpleDom.Store();
SimpleDom.renderToDom('clock', <Clock />, store);

setInterval(() => store.updateState({}, 'UPDATE_CLOCK'), 1000);