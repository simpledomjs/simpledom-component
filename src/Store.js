
let generatedId = 1;

function generateId() {
    return generatedId++;
}

export class Store {
    constructor(initialeState) {
        this.state = initialeState;
        this.subscribers = {};
    }

    sendState(event, newState) {
        this.state = {...this.state, ...newState};
        Object.keys(this.subscribers[event] || {}).map(id => this.subscribers[event][id])
            .forEach(callback => callback(event, this.state));

    }

    subscribe(event, callback = state => {}) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = {};
        }
        const id = generateId();
        this.subscribers[event][id] = callback;
        return id;
    }

    unsubsribe(id) {
        for (let event of Object.keys(this.subscribers)) {
            if (this.subscribers[event][id]) {
                delete this.subscribers[event][id];
            }
        }
    }
}
