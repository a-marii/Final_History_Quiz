///const db = require("./models/")
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://nexza:tNSNJjX1E1@cluster0.frz4a.mongodb.net/todos", {
  // connecting to the mongodb database name: "todo-app" locally
  keepAlive: true, // keeping the connection alive
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.set("debug", true) // enabling debugging information to be printed to the console for debugging purposes
mongoose.Promise = Promise // setting mongoose's Promise to use Node's Promise
module.exports.Todo = require("./todo") // requiring the todo model that we just created in mongodb