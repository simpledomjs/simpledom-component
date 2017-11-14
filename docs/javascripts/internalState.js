import * as SimpleDom from 'simpledom-component';


class App extends SimpleDom.Component {

    constructor(props, store) {
        super(props, store);
        this.todos = [
            {
                todo: "Find a better example",
                done: false
            }
        ]
    }

    render() {
        return (
            <div>
                <ul>
                    {this.todos.map(todo =>
                        <li
                            onClick={() => {
                                todo.done = !todo.done;
                                this.refresh()
                            }}
                            style={{
                                textDecoration: todo.done ? 'line-through' : undefined,
                                listStyleType: 'none'
                            }}
                        >
                            {todo.todo}
                        </li>
                    )}
                </ul>
                <input type='text' placeholder='New todo'
                       onKeyUp={event => {
                           if (event.keyCode === 13) {
                               this.todos.push({todo: event.target.value});
                               this.refresh();
                           }
                       }}
                />
            </div>
        );
    }
}

SimpleDom.renderToDom('internalState', <App/>);