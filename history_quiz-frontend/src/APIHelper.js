import axios from "axios"

const API_URL = "https://history-quiz-1.herokuapp.com/todos/"

async function createTodo(task, completed1,completed2,completed3,completed4 ) {
  const { data: newTodo } = await axios.post(API_URL, {
    task,
    completed1,
    completed2,
    completed3,
    completed4
  })
  return newTodo
}

async function deleteTodo(id) {
  const message = await axios.delete(`${API_URL}${id}`)
  return message
}

async function updateTodo(id, payload) {
  const { data: newTodo } = await axios.put(`${API_URL}${id}`, payload)
  return newTodo
}

async function getAllQuestion() {
  const { data: todos } = await axios.get(API_URL)
  return todos
}

export default { createTodo, deleteTodo, updateTodo, getAllQuestion }