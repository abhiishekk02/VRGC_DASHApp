import React, { useState, useEffect } from 'react';
import "./styles/Apps.css";
import useUser from '../../../../private/UseUser';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 
  const { setStatusMessage } = useUser();

  
  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:3006/todolist`);
      if (response.ok) {
        const todosData = await response.json();
        const sortedTodos = sortOrder === 'asc' ? todosData.reverse() : todosData;
        setTodos(sortedTodos);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  
  useEffect(() => {
    fetchTodos();
  }, [sortOrder]);

  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  
  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      const data = { todo: inputValue };

      try {
        const response = await fetch('http://localhost:3006/todolist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          fetchTodos(); 
          setInputValue('');
          setStatusMessage(['Todo Added', 'success', true]);
        } else {
          throw new Error('Failed to add todo');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3006/todolist/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTodos(); 
        setStatusMessage(['Todo Deleted', 'success', true]);
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  
  
  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div id="todo-list-app" className="todo-list-app">
      <div className="todo-list-header d-flex justify-content-between align-items-center">
        <p className="todo-list-appname">To-Do List</p>
        <button className="btn btn-light" onClick={handleSortToggle}>
  <i className={`bi bi-sort-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
  <i className={`bi bi-caret-${sortOrder === 'desc' ? 'down' : 'up'}-fill ms-1`}></i>
</button>

       
      </div>
      <div className="input-group  todo-list-content">
        <input
          type="text"
          className="form-control"
          placeholder="Add new todo"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="list-group todo-list-group todo-list-scrollable">
        {todos.map((todo) => (
          <li className="list-group-item" key={todo.todo_id}>
            {todo.todo}
            <button className="btn btn-danger btn-sm float-end" onClick={() => handleDeleteTodo(todo.todo_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
