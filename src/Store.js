
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
    constructor(initialeState) {
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
    }

    /**
     * Method to call to change the state.
     * @param {string} event event to the origin of the state change.
     * @param {object} newState the new state (you can put only attributes changed).
     */
    sendState(event, newState) {
        this.state = {...this.state, ...newState};
        Object.keys(this.subscribers[event] || {}).map(id => this.subscribers[event][id])
            .forEach(callback => callback(event, this.state));

    }

    /**
     * Method to call to subscribe to an event.
     * @param {string} event event to subscribe.
     * @param {function(event: string, state: object)} callback the callback called when receive the event.
     * @return {number} the id to put in param of {@link unsubscribe} to unsubscribe.
     */
    subscribe(event, callback = state => {}) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = {};
        }
        const id = generateId();
        this.subscribers[event][id] = callback;
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
}
