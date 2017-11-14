import * as SimpleDom from '../src/main';

import chai from 'chai';

const expect = chai.expect;

function cleanContainer() {
    if (document.getElementById('container')) {
        document.getElementById('container').remove();
    }

    const container = document.createElement('div');
    container.id = 'container';

    document.body.appendChild(container);
}

describe('Store API', () => {
    it('Catch all', () => {
        const store = new SimpleDom.Store();

        let eventCounter = 0;
        let allCounter = 0;

        store.subscribe('event', () => eventCounter++);
        store.subscribe('*', () => allCounter++);

        store.updateState({}, 'otherEvent');

        expect(allCounter).to.be.equal(1);
        expect(eventCounter).to.be.equal(0);

        store.updateState({}, 'event');

        expect(allCounter).to.be.equal(2);
        expect(eventCounter).to.be.equal(1);

    });
});

describe('SimpleDom component API', () => {

    it('SimpleTest', () => {

        cleanContainer();

        class HelloWorld extends SimpleDom.Component {
            render() {
                return (
                    <h1>Hello {this.props.name}!</h1>
                );
            }
        }


        SimpleDom.renderToDom(
            'container', <HelloWorld name="John"/>
        );

        expect(document.getElementById('container').innerHTML).to.be.equal(
            '<h1>Hello John!</h1>');
    });

    it('Bug with component with no render if precedent has render', () => {
        cleanContainer();

        class ComponantA extends SimpleDom.Component {
            render() {
                return (
                    <div></div>
                )
            }
        }

        class ComponentB extends SimpleDom.Component {

        }

        SimpleDom.renderToDom(
            'container',
            <div>
                <ComponantA/>
                <ComponentB/>
            </div>
        );

        expect(document.getElementById('container').innerHTML).to.be.equal('<div><div></div><div style="width: 0px; height: 0px;"></div></div>');

    });

    class Counter extends SimpleDom.Component {
        eventsToSubscribe() {
            return ['UPDATE_COUNTER'];
        }

        render() {
            return (
                <h1 id="counter-h1">{this.state.counter || 0}</h1>
            );
        }
    }

    class IncCounter extends SimpleDom.Component {
        inc() {
            this.store.updateState({counter: (this.state.counter || 0)+1}, 'UPDATE_COUNTER');
        }

        render() {
            return (
                <button id="inc-button" onClick={this.inc}>+1</button>
            );
        }
    }

    it('Un simple reactive component', () => {
        cleanContainer();

        SimpleDom.renderToDom(
            'container',
            <div>
                <Counter/>
                <IncCounter/>
            </div>,
            new SimpleDom.Store({counter: 0})
        );

        const buttonNode = document.getElementById('inc-button');

        const counterNode = document.getElementById('counter-h1');

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('0');

        document.getElementById('inc-button').click();

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('1');

        expect(document.getElementById('container').contains(buttonNode)).to.be.true;
        expect(document.getElementById('container').contains(counterNode)).to.be.false;

    })

    class SimpleCounter extends SimpleDom.Component {

        constructor(props, store) {
            super(props, store);
            this.counter = 0;
        }

        inc() {
            this.counter++;
            this.refresh();
        }

        render() {
            return (
                <div>
                    <h1 id="counter-h1">{this.counter}</h1>
                    <button id="inc-button" onClick={this.inc}>+1</button>
                </div>
            );
        }
    }

    it('Un simple reactive component with internal state', () => {
        cleanContainer();

        SimpleDom.renderToDom(
            'container',
            <SimpleCounter/>
        );

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('0');

        document.getElementById('inc-button').click();

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('1');

        document.getElementById('inc-button').click();

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('2');

    })

    it('A simple reactive component with SimpleDom.renderTo', () => {
        cleanContainer();



        SimpleDom.renderTo(
            'container',
            <div>
                <Counter/>
                <IncCounter/>
            </div>
        );

        const buttonNode = document.getElementById('inc-button');

        const counterNode = document.getElementById('counter-h1');

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('0');

        document.getElementById('inc-button').click();

        expect(document.getElementById('counter-h1').innerHTML).to.be.equal('1');

        expect(document.getElementById('container').contains(buttonNode)).to.be.true;
        expect(document.getElementById('container').contains(counterNode)).to.be.false;

    });

    it('A test with ref to upper level', () => {

        cleanContainer();

        class TestRef extends SimpleDom.Component {

            eventsToSubscribe() {
                return ['TEST']
            }

            componentDidMount() {
                this.div.querySelector('h1').innerText = 'ref';
            }

            render() {
                return <div ref={ref => this.div = ref}>
                    <h1>test</h1>
                </div>
            }

        }

        SimpleDom.renderTo(
            'container',
            <div>
                <TestRef/>
            </div>
        );

        expect(document.getElementById('container').innerHTML).to.be.equal('<div><div><h1>ref</h1></div></div>');


    })



    it('Test with multiple component inside component', () => {

        class Component1 extends SimpleDom.Component {
            render() {
                return <div>{this.state.counter || 0}</div>;
            }

        }

        class Component2 extends SimpleDom.Component {
            render() {
                return <Component1/>;
            }
        }

        class Component3 extends SimpleDom.Component {
            eventsToSubscribe() {
                return ['EVENT'];
            }

            render() {
                return <Component2/>;
            }
        }

        cleanContainer();
        const store = new SimpleDom.Store();
        SimpleDom.renderToDom('container', <Component3/>, store);

        expect(document.getElementById('container').innerHTML).to.be.equal('<div>0</div>');

        store.updateState({counter: 1}, 'EVENT');

        expect(document.getElementById('container').innerHTML).to.be.equal('<div>1</div>');

    })

});
