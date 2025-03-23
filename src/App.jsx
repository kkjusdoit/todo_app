import './App.css'
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// 常量提取
const MESSAGES = {
  EMPTY_INPUT: '请输入内容',
  EMPTY_TODO: '请在下方输入待办事项',
  EMPTY_FINISHED: '已完成的任务将显示在这里'
};

function Title({ todos }) {
  return (
    <h1>Todo App : {todos.length}</h1>
  )
}

Title.propTypes = {
  todos: PropTypes.array.isRequired
};

function TodoList({ todos, deleteTodo, toggleFinish }) {
  const todoItems = todos.filter(todo => !todo.isFinish)
    .map(todo => (
      <li key={todo.id}> 
        <button onClick={() => deleteTodo(todo.id)}>
          Delete
        </button>
        {todo.content} 
        <button onClick={() => toggleFinish(todo.id)}>
          Finish
        </button>
      </li>
    ));

  return todoItems.length === 0 ? (
    <div>{MESSAGES.EMPTY_TODO}</div>
  ) : (
    <div>
      <ol>{todoItems}</ol>
    </div>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  toggleFinish: PropTypes.func.isRequired
};

function InputBox({ addTodo }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      console.log(MESSAGES.EMPTY_INPUT);
      return;
    }
    addTodo(inputValue.trim());
    setInputValue("");
  };

  return (
    <div>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button onClick={handleSubmit}>
        Confirm
      </button>
    </div>
  );
}

InputBox.propTypes = {
  addTodo: PropTypes.func.isRequired
};

function FinishList({ todos }) {
  const finishedItems = todos
    .filter(todo => todo.isFinish)
    .map(todo => (
      <li key={todo.id}> 
        <span style={{ textDecoration: "line-through" }}>{todo.content}</span>
      </li>
    ));

  return finishedItems.length === 0 ? (
    <div>{MESSAGES.EMPTY_FINISHED}</div>
  ) : (
    <div>
      <ol>{finishedItems}</ol>
    </div>
  );
}

FinishList.propTypes = {
  todos: PropTypes.array.isRequired
};

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = useCallback((content) => {
    const newTodo = {
      id: Date.now(),
      content,
      isFinish: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  const toggleFinish = useCallback((id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, isFinish: !todo.isFinish } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  return (
    <>
      <Title todos={todos} />
      <TodoList 
        deleteTodo={deleteTodo} 
        toggleFinish={toggleFinish} 
        todos={todos}
      />
      <InputBox addTodo={addTodo} />
      <FinishList todos={todos} />
      <p>By kkjusdoit</p>
    </>
  );
}

export default App;
