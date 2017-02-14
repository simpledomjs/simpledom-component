

let generatedId = 1;

function generateId() {
    return generatedId++;
}

/**
 * A simple Store which receive all state changes with an event (string).
 */
export class Store {
    /**
     * The constructor.
     * @param {object} initialeState the initial state.
     */
    constructor(initialeState = {}) {
        /**
         * The state of store.
         * @type {object}
         */
        this.state = initialeState;
        /**
         * Don't touch :)
         * @type {Object}
         */
        this.subscribers = {};

        /**
         * Don't touch :)
         * @type {Array}
         */
        this.componentsSubscribes = [];
    }

    /**
     * Method to call to change the state.
     * @param {object} newState the new state (you can put only attributes changed).
     * @param {...string} events events to the origin of the state change.
     */
    updateState(newState, ...events) {
        const oldState = this.state;
        this.state = {...this.state, ...newState};

        const eventsToPropagate = events.concat('*');

        let index = eventsToPropagate.length;
        while (index--) {
            const event = eventsToPropagate[index];
            if (this.subscribers[event]) {
                for (const id in this.subscribers[event]) {
                    if (this.subscribers[event].hasOwnProperty(id)) {
                        this.subscribers[event][id](event, this.state, oldState);
                    }
                }
            }
        }
    }

    /**
     * Method to call to subscribe to an event.
     *
     * There is a special event that catches all events : '*'.
     *
     * @param {string} event event to subscribe.
     * @param {function(event: string, state: object, oldState:object)} callback the callback called when receive the event.
     * @param {Component} component use internally to unsubcribe component when node disappear
     * @return {number} the id to put in param of {@link unsubscribe} to unsubscribe.
     */
    subscribe(event, callback = state => {}, component) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = {};
        }
        const id = generateId();
        this.subscribers[event][id] = callback;

        if (component) {
            let componentWrapper = undefined;
            for (const componentAlreadySubcribes of this.componentsSubscribes) {
                if (componentAlreadySubcribes.component === component) {
                    componentWrapper = componentAlreadySubcribes;
                    break;
                }
            }
            if (!componentWrapper) {
                componentWrapper = {
                    component,
                    subscribes: []
                };
                this.componentsSubscribes.push(componentWrapper);
            }
            componentWrapper.subscribes.push({
                event,
                id
            });
        }

        return id;
    }

    /**
     * Unsubscribe.
     * @param {number} id id received at {@link subscribe}
     */
    unsubsribe(id) {
        for (let event of Object.keys(this.subscribers)) {
            if (this.subscribers[event][id]) {
                delete this.subscribers[event][id];
            }
        }
    }

    /**
     * Unsubcribe all subcribers.
     */
    unsubscribeAll() {
        this.subscribers = {};
        this.componentsSubscribes = [];
    }



    /**
     * Unsubscribe.
     * @param {string} event event sent to {@link subscribe}
     * @param {number} id id received at {@link subscribe}
     */
    unsubscribeByEventAndId(event, id) {
        if (this.subscribers[event][id]) {
            delete this.subscribers[event][id];
        }
    }
}
