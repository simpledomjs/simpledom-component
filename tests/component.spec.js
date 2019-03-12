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
        let lastEvent = '';

        store.subscribe('event', () => eventCounter++);
        store.subscribe('*', (event) => {
            lastEvent = event;
            allCounter++;
        });

        store.updateState({}, 'otherEvent');

        expect(allCounter).to.be.equal(1);
        expect(eventCounter).to.be.equal(0);
        expect(lastEvent).to.be.equal('otherEvent');

        store.updateState({}, 'event');

        expect(allCounter).to.be.equal(2);
        expect(eventCounter).to.be.equal(1);
        expect(lastEvent).to.be.equal('event');


        store.updateState({}, 'event', 'otherEvent');
        
        expect(allCounter).to.be.equal(3);
        expect(eventCounter).to.be.equal(2);
        expect('' + lastEvent).to.be.equal('event,otherEvent');

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


    });



    it('A test for unmounting', (done) => {

        function timeoutPromise(action) {
            const promise = new Promise((resolve) => {
                setTimeout(() => {
                    action();
                    resolve()
                })
            });
            return promise;
        }

        cleanContainer();

        const umountCount = {count: 0};

        class TestUnmountOnEvent extends SimpleDom.Component {
            eventsToSubscribe() {
                return ['TEST'];
            }


            componentDidUnmount() {
                umountCount.count = umountCount.count + 1;
            }

            render() {
                return <div>
                    Test unmount
                </div>
            }

        }

        class TestUnmount extends SimpleDom.Component {

            componentDidUnmount() {
                umountCount.count = umountCount.count + 1;
            }

            render() {
                return <div>
                    Test unmount
                </div>
            }

        }

        class TestComponent extends SimpleDom.Component {
            eventsToSubscribe() {
                return ['TEST']
            }

            render() {
                return (
                    <div>
                        <TestUnmount/>
                    </div>
                );
            }
        }

        let store = new SimpleDom.Store();

        SimpleDom.renderToDom(
            'container',
            <div>
                <TestUnmount/>
            </div>,
            store
        );

        store = new SimpleDom.Store();


        expect(umountCount.count).to.be.equal(0);

        SimpleDom.renderToDom(
            'container',
            <div>
                <TestComponent/>
            </div>,
            store
        );

        timeoutPromise(() => {

            expect(umountCount.count).to.be.equal(1);

            store.updateState({}, 'TEST');
        }).then(() => {

            expect(umountCount.count).to.be.equal(2);

            store = new SimpleDom.Store();

            SimpleDom.renderToDom(
                'container',
                <div>
                    <TestUnmountOnEvent/>
                </div>,
                store
            );
        }).then(() => {

            expect(umountCount.count).to.be.equal(3);

            store.updateState({}, 'TEST');
        }).then(() => {
            expect(umountCount.count).to.be.equal(4);
            done();
        })

    })



    it('Test with multiple component inside component', () => {

        class Component1 extends SimpleDom.Component {
            render() {
                return <div>{this.state.counter || 0}</div>;
            }

        }

        class Component2 extends SimpleDom.Component {
            eventsToSubscribe() {
                return ['EVENT2'];
            }
            
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

        store.updateState({counter: 2}, 'EVENT');

        expect(document.getElementById('container').innerHTML).to.be.equal('<div>2</div>');

        store.updateState({counter: 1}, 'EVENT2');

        expect(store.componentsSubscribes.length).to.be.equal(2);

        expect(document.getElementById('container').innerHTML).to.be.equal('<div>1</div>');

        store.updateState({counter: 2}, 'EVENT2');

        expect(document.getElementById('container').innerHTML).to.be.equal('<div>2</div>');

    });



    it('Test with multiple component inside component and refresh after update state on parent', () => {

        class ComponentButton extends SimpleDom.Component {
            eventsToSubscribe() {
                return ['EVENT2'];
            }

            render() {
                return <button onClick={() => {
                    this.store.updateState({counter: this.state.counter+1}, 'EVENT');
                    this.refresh();
                }}>{this.state.counter}</button>;
            }
        }

        class ComponentParent extends SimpleDom.Component {
            eventsToSubscribe() {
                return ['EVENT'];
            }

            render() {
                return <ComponentButton/>;
            }
        }

        cleanContainer();
        const store = new SimpleDom.Store({counter: 0});
        SimpleDom.renderToDom('container', <ComponentParent/>, store);

        expect(document.getElementById('container').innerHTML).to.be.equal('<button>0</button>');

        document.getElementById('container').querySelector("button").click();

        expect(document.getElementById('container').innerHTML).to.be.equal('<button>1</button>');

        document.getElementById('container').querySelector("button").click();

        expect(document.getElementById('container').innerHTML).to.be.equal('<button>2</button>');

        document.getElementById('container').querySelector("button").click();

        expect(document.getElementById('container').innerHTML).to.be.equal('<button>3</button>');

    });

    it('Reacts to events without rendering', () => {

        class Component1 extends SimpleDom.Component {
            componentDidMount() {
                document.getElementsByTagName('h1')[0].innerText = 'Mounted';
            }

            eventsToSubscribe() {
                return ['EVENT1'];
            }

            eventsToReact() {
                return ['EVENT'];
            }

            react(event) {
                switch (event) {
                    case 'EVENT':
                        document.getElementsByTagName('h1')[0].innerText = 'React To Event';
                    default: break;
                }
            }

            render() {
                return <div>{this.state.counter || 0}</div>;
            }

        }


        cleanContainer();
        const store = new SimpleDom.Store();
        SimpleDom.renderToDom('container',
            <div>
                <h1>&nbsp;</h1>
                <Component1/>
            </div>, store);


        expect(document.getElementsByTagName('h1')[0].innerText).to.be.equal('Mounted');

        store.updateState({}, 'EVENT');
        expect(document.getElementsByTagName('h1')[0].innerText).to.be.equal('React To Event');

        store.updateState({}, 'EVENT1');
        expect(document.getElementsByTagName('h1')[0].innerText).to.be.equal('Mounted');

    })



    class FocusableComponent extends SimpleDom.Component {
        focus() {
            this.input.focus();
        }
        render() {
            return (
                <input id="focusableComponentInput" ref={(ref) => this.input = ref}/>
            );
        }
    }

    class AppFocusableComponent extends SimpleDom.Component {
        render() {
            return  <div>
                <FocusableComponent ref={(ref) => this.focusableComp = ref}/>
                <button id="focus-button" onClick={() => this.focusableComp.focus()}>Put Focus</button>
            </div>
        }
    }

    it('Reference a component and call it\'s function', () => {
        cleanContainer();

        SimpleDom.renderToDom(
            'container',
           <AppFocusableComponent/>
        );

        document.getElementById('focus-button').click();
        expect(document.activeElement).to.be.equal(document.getElementById('focusableComponentInput'));

    })

});
