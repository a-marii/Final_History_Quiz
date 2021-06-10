import axios from "axios"

const API_URL = "https://history-quiz-1.herokuapp.com/todos/"


async function getAllQuestion() {
  const { data: todos } = await axios.get(API_URL)
  return todos
}

export default { getAllQuestion }