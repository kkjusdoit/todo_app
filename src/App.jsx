import './App.css'
import { useState, useCallback, useEffect, memo } from 'react';

// 常量提取
const MESSAGES = {
  EMPTY_INPUT: '请输入内容',
  EMPTY_TODO: '请在下方输入待办事项',
  EMPTY_FINISHED: '已完成的任务将显示在这里'
};

const Title = memo(function Title({ todos }) {
  const unfinishedTodos = todos.filter(todo => !todo.isFinish);
  return (
    <h1 className="text-4xl font-bold text-white mb-8">
      Todo List : {unfinishedTodos.length}
    </h1>
  )
});

const TodoList = memo(function TodoList({ todos, deleteTodo, toggleFinish }) {
  const todoItems = todos.filter(todo => !todo.isFinish)
    .map((todo, index) => (
      <li key={todo.id} className="bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-all" style={{display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', width: '100%', gap: '8px'}}>
        <span className="text-white">{index + 1}.</span>
        <span className="text-white" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{todo.content}</span>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0}}>
          <input
            type="checkbox"
            checked={todo.isFinish}
            onChange={() => toggleFinish(todo.id)}
            className="w-4 h-4 border-2 border-blue-500 rounded text-blue-500 focus:ring-blue-500 cursor-pointer bg-gray-700"
          />
          <button 
            onClick={() => deleteTodo(todo.id)}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </li>
    ));

  return todoItems.length === 0 ? (
    <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg shadow-sm">
      {MESSAGES.EMPTY_TODO}
    </div>
  ) : (
    <div className="w-full max-w-2xl">
      <ol className="space-y-2 list-none">{todoItems}</ol>
    </div>
  );
});

const InputBox = memo(({ addTodo }) => {
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
    <div className="flex gap-2 my-8 w-full">
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="flex-1 px-4 py-2 bg-gray-800 text-white border-2 border-gray-700 rounded-lg 
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="添加新的待办事项..."
      />
      <button 
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        添加
      </button>
    </div>
  );
});

const FinishList = memo(({ todos }) => {
  const finishedItems = todos
    .filter(todo => todo.isFinish)
    .sort((a, b) => b.id - a.id)
    .slice(0,5) //only keep latest 5 todos
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
});

const App = () => {
  // 从 localStorage 读取初始数据，如果没有则使用空数组
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // 当 todos 变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (content) => {
    if (content.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      content,
      isFinish: false,
    };
    
    setTodos([...todos, newTodo]);
  };

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
    <div className="min-h-screen bg-gray-900 py-12 px-4 flex flex-col">
      <div className="container mx-auto max-w-3xl flex flex-col items-center flex-grow">
        <Title todos={todos} />
        <TodoList 
          deleteTodo={deleteTodo} 
          toggleFinish={toggleFinish} 
          todos={todos}
        />
        <InputBox addTodo={addTodo} />
        <FinishList todos={todos} />
      </div>
      <footer className="w-full mt-auto py-4">
        <p className="text-gray-500 text-center">
          &copy; {new Date().getFullYear()} kkjusdoit. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
