import { useState } from "react";


function TodoList() {
    const [todos, setTodos] = useState<string[]>([
        "Learn React",
        "Build a ToDo App",
        "Master TypeScript"
    ]);

    const [todo, setTodo] = useState<string>("");

    const [selectedIndex, setSelectedIndex] = useState<number | null>(-1);

    const list = todos.map((todo, index) => {
        return (
            <li onClick={() => setSelectedIndex(index)}
                className={`list-group-item ${selectedIndex === index ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                key={index}>
                {todo}
            </li>
        );
    });

    const addTodo = (todo: string) => {
        if (todo.trim() === "") return;
        setTodos([...todos, todo]);
        setTodo("");
    };
    const removeTodo = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
        setSelectedIndex(-1);

    };


    return (
        <div className="container">
            <h2>Todo List</h2>

            <div className="mb-3 col-5">
                <label>Add a new task</label>
                <input type="text" className="form-control" 
                placeholder="New Task" 
                value={todo} 
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={ (e) => e.key === 'Enter' && addTodo(todo) } 
                />
            </div>

            <div className="offset-2 mb-2">

                <button className="btn btn-primary col-2" onClick={() => addTodo(todo)}>Add Task</button>

                <button disabled={selectedIndex === -1}
                    className="btn btn-danger col-2"
                    onClick={() => removeTodo(selectedIndex!)}>Remove Task</button>
            </div>

            <ul className="list-group">
                {list}
            </ul>
        </div>
    );
}

export default TodoList;
