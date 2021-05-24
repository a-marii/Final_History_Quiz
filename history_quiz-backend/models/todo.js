const mongoose = require("mongoose") // requiring the mongoose package

const todoSchema = new mongoose.Schema({
  id:{
    type:Number,
    unique: true, // it has to be unique
  },
  // creating a schema for todo
  task: {
    // field1: task
    type: String, // task is a string
    unique: true, // it has to be unique
    required: true, // it is required
  },
  answer1: {
    // field2: completed
    type: String, // it is a boolean
  },
  answer2: {
    // field2: completed
    type: String, // it is a boolean
  },
  answer3: {
    // field2: completed
    type: String, // it is a boolean
  },
  answer4: {
    // field2: completed
    type: String, // it is a boolean
  },
  true_answer: {
    // field2: completed
    type: String, // it is a boolean
  }
})

const todoModel = mongoose.model("Todo", todoSchema) // creating the model from the schema

module.exports = todoModel // exporting the model