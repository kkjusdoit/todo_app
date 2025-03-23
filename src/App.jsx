import './App.css'
import { useState } from 'react';
function Title(props){
  return (
    <h1>Todo App : {props.todos.length}</h1>
  )
}

function TodoList(props){
  let to_do_list = props.todos.filter((todo) => {
    return !todo.isFinish; // 条件：返回true的项会被保留
  });

  const OnClickDeleteBtn = (id)=>{
    console.log('on click delete ' + id)
    props.deleteTodo(id);
  }

  const OnClickFinishBtn = (id) => {
    console.log('on click finish ' + id)

    props.toggleFinish(id)
  }
  to_do_list = to_do_list.map((todo) => {
    return (
      <li key = {todo.id}> 
        <button onClick={() => OnClickDeleteBtn(todo.id)}>
        Delete
        </button>
        {todo.content} 
        <button onClick={() => OnClickFinishBtn(todo.id)}>
          Finish
        </button>
      </li>
    ) 
  });
  if (to_do_list.length === 0){
    return(
      <div>pls input your todo below</div>
    )
  }
  return (
    <div>
      <ol>{to_do_list}</ol>
    </div>
  )
}

function InputBox(props){
  const [inputValue, setInputValue] = useState("");
  const OnClickBtn = () =>{
    if (inputValue === ""){
      console.log('pls input content');
      return;
    }
    console.log("before" + inputValue)
    props.addTodo(inputValue);
    setInputValue(""); //这行还是有必要的，input里还会有内容
    console.log("after" + inputValue)
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  };
  return (
    <div>
      {<input type="text" value = {inputValue} onChange = {handleInputChange}/>}
      <button onClick={OnClickBtn}>
        Confirm
      </button>
    </div>

  )
}

function FinishList(props){
    const to_do_list = props.todos
      .filter((todo) => todo.isFinish)
      .map((todo) => {
        return (

          <li key = {todo.id}> 
            <span style={{ textDecoration: "line-through" }}>{todo.content}</span>
          </li>
        )
    });
    if (to_do_list.length === 0){
      return (
        <div>your tasks be completed will show here</div>
      )
    }
    return (
      <div>
        <ol>{to_do_list}</ol>
      </div>
    )
}



function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (content) => {
    const newTodo = {

      id : Date.now(),
      content : content,
      isFinish : false,
    }
    setTodos([... todos,newTodo]);
  };

  const toggleFinish = (id) => {
    const updateList = todos.map((todo) => {
      if (todo.id === id){
        return {...todo, isFinish:!todo.isFinish};
      }
      return todo;
    })
    setTodos(updateList);
  }

  const deleteTodo = (id) => {
    const updatedList = todos.filter((todo) => todo.id !== id); // 直接过滤掉指定id的项
    console.log("delete todo", updatedList.length); // 输出更新后的列表
    setTodos(updatedList);
  };


  return (
    <>
    <Title todos = {todos}/>
      <div>
        <TodoList deleteTodo = {deleteTodo} toggleFinish = {toggleFinish} todos = {todos}/>

      </div>
      <div>
        <InputBox addTodo={addTodo} />
      </div>

      <div>
        <FinishList todos = {todos}/>
      </div>
      <p>
        By kkjusdoit
      </p>
    </>
  )
}

export default App
