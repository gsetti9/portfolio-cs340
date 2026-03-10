var express = require('express')
var quizData = require("./quizzes.json")
var fs = require("fs")
var port = process.env.PORT || 8000
var app = express()

app.set("view engine", "ejs")

app.use(express.static('static'))
app.use(express.json())

// Log every request out
app.use(function (req, res, next) {
  console.log("== Request recieved")
  console.log(" -- method:", req.method)
  console.log(" -- url:", req.url)
  next()
})

// Home page
app.get("/", function (req, res, next) {
  var quizzes = []
  
  if (fs.existsSync("quizzes.json")) {
    var raw = fs.readFileSync("quizzes.json", "utf8")
    quizzes = JSON.parse(raw)
  }
  
  res.status(200).render("index", {
    quizzes: quizzes
  })
})

// Quiz creation page
app.get("/createQuiz", function (req, res, next) {
  // Gather information from URL request
  var name = req.query.name
  var photo = req.query.photo
  var subject = req.query.subject

  // Render create quiz template
  res.status(200).render("createQuiz", {
    name: name,
    photo: photo,
    subject: subject
  })
})

// Quiz creation submission
app.post("/createQuiz", function (req, res, next) {

  // Get quiz data
  var quizData = req.body

  // Ensure required data is there
  if (!quizData || !quizData.name || !quizData.questions) {
    res.status(400).send("Missing quiz data.")
    return
  }

  // Load existing quizzes or create new array
  var quizzes = []

  // If quizzes.json exists, load it into quizzes
  if (fs.existsSync("quizzes.json")) {
    var raw = fs.readFileSync("quizzes.json", "utf8")
    quizzes = JSON.parse(raw)
  }

  // Append new quiz
  quizzes.push(quizData)

  // Save back to file
  fs.writeFile("quizzes.json", JSON.stringify(quizzes, null, 2), function (err) {
    if (err) {
      console.log("Error writing file:", err)
      res.status(500).send("Error saving quiz.")
    } else {
      res.status(200).send("Quiz saved.")
    }
  })
})


app.get("/quizzes/:id", function (req, res, next){
  var id = parseInt(req.params.id)
  
  if (fs.existsSync("quizzes.json")) {
    var raw = fs.readFileSync("quizzes.json", "utf8")
    quizzes = JSON.parse(raw)
  }

  if (isNaN(id) || id < 0 || id >= quizzes.length){
    res.status(404).render("404")
  }

  var quiz = quizzes[id]
   
  res.status(200).render("quiz", {
    quiz: quiz,
    id: id
  })
})

// 404 page
app.get("*splat", function (req, res, next) {
  res.status(200).render("404")
})

// Begin server
app.listen(port, function (err) {
  if (err) {
    throw err
  }
  console.log("== Server listening on port", port)
})
