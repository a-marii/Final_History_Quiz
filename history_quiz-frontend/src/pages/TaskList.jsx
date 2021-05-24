import React from 'react';
import {AddTask} from '../components/AddTask';
import {TaskItemList} from '../components/TaskItemList';


export const TaskList = (props) => {
  const { items, onAdd} = props;
  return (
    
    <main className="container">
      <AddTask
        onAdd = { onAdd }
        items  = { items }
      />
      <ui className="question">Вопрос1: </ui>
     <ui className="answer">Ваш ответ: {items}</ui>
    </main>
  )
}