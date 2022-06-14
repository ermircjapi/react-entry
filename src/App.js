import React, {useState} from "react";
import {Route, Routes, useNavigate} from 'react-router-dom';
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import {nanoid} from "nanoid";

const DATA = [
    {id: "todo-0", name: "Eat", completed: true},
    {id: "todo-1", name: "Sleep", completed: false},
    {id: "todo-2", name: "Repeat", completed: false}
];

const FILTER_MAP = {
    All: () => true,
    Active: task => !task.completed,
    Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {

    function addTask(name) {
        const newTask = {id: "todo-" + nanoid(), name: name, completed: false};
        setTasks([...tasks, newTask]);
    }

    function deleteTask(id) {
        const remainingTasks = tasks.filter(task => id !== task.id);
        setTasks(remainingTasks);
    }

    function editTask(id, newName) {
        const editedTaskList = tasks.map(task => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
                return {...task, name: newName}
            }
            return task;
        });
        setTasks(editedTaskList);
    }

    function toggleTaskCompleted(id) {
        const updatedTasks = tasks.map(task => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
                // use object spread to make a new object
                // whose `completed` prop has been inverted
                return {...task, completed: !task.completed}
            }
            return task;
        });
        setTasks(updatedTasks);
    }

    const [tasks, setTasks] = useState(DATA);
    const [filter, setFilter] = useState('All');

    const taskList = tasks
        .filter(FILTER_MAP[filter])
        .map(task => (
            <Todo id={task.id}
                  name={task.name}
                  completed={task.completed}
                  key={task.id}
                  toggleTaskCompleted={toggleTaskCompleted}
                  deleteTask={deleteTask}
                  editTask={editTask}/>
        ));

    const filterList = FILTER_NAMES.map(name => (
        <FilterButton key={name}
                      name={name}
                      isPressed={name === filter}
                      setFilter={setFilter}/>
    ));

    const headingText = `${taskList.length} tasks remaining`;

    const navigate = useNavigate();

    return (
        <div className="todoapp stack-large">
            <h1>List of tasks</h1>
            <Routes>
                <Route path="/add" element={<Form addTask={addTask}/>}></Route>
                <Route path="/" element={[taskList, filterList]}></Route>
            </Routes>
            <button type="button" onClick={() => navigate("/add")}>
                Add New task
            </button>
        </div>
    );
}

export default App