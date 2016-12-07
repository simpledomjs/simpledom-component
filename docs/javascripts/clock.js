import * as SimpleDom from 'simpledom-component';

class Clock extends SimpleDom.ConnectedComponent {
    eventsToSubscribe() {
        return ['UPDATE_CLOCK'];
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {new Date().toLocaleTimeString()}.</h2>
            </div>
        );
    }

}

const store = new SimpleDom.Store();
SimpleDom.renderToDom('clock', <Clock />, store);

setInterval(() => store.updateState({}, 'UPDATE_CLOCK'), 1000);