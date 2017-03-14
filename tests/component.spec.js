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

        expect(document.getElementById('container').innerHTML).to.be.equal('<div><div></div></div>');

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



    it('Un simple reactive component with SimpleDom.renderTo', () => {
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

    })

});
