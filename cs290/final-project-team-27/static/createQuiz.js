// Question counter
let questionCounter = 0;

function addQuestionButtonClick(event) {
  // Gather type of quiz and the container for creating a question
  var type = document.getElementById('question-type-select').value
  var container = document.querySelector('.creating-question-container')
  var questionHTML = ''

  // If type is invalid,
  if (!type) {
    alert("Please select a type.")
  }

  // Increment and record question number
  var questionNumber = questionCounter++;

  if (type == "Multi-choice") {
    questionHTML = window.templates.choiceQuestion({ 
      type: 'Multi-choice', 
      numChoices: 4,
      questionNumber: questionNumber 
    })
  } else if (type == "Single-choice") {
    questionHTML = window.templates.choiceQuestion({ 
      type: 'Single-choice', 
      numChoices: 4,
      questionNumber: questionNumber 
    })
  } else if (type == "Text") {
    questionHTML = window.templates.textQuestion({
      questionNumber: questionNumber
    })
  } else {
    alert("Please select a given type.")
  }

  container.insertAdjacentHTML('beforeend', questionHTML)

  // Event listeners to update number of choices for choice options
  if (type === "Single-choice" || type === "Multi-choice") {
    var lastQuestion = container.lastElementChild
    var numChoicesInput = lastQuestion.querySelector('.num-choices')

    // Render initial choices
    updateChoices(lastQuestion, type, numChoicesInput.value, questionNumber)

    // Update choices if number changes
    numChoicesInput.addEventListener('change', function() {
      updateChoices(lastQuestion, type, numChoicesInput.value, questionNumber)
    })
  }
}

// Update number of choices dynamically
function updateChoices(questionElem, type, numChoices, questionNumber) {
  var choicesContainer = questionElem.querySelector('.choices-container')
  choicesContainer.innerHTML = '' // Clear old choices

  numChoices = Math.max(1, Math.min(9, parseInt(numChoices))) // Ensure 1-9

  // Insert the number of choices selected
  for (let i = 0; i < numChoices; i++) {
    var choiceHTML = window.templates.choice({ 
      index: i, 
      type: type,
      questionNumber: questionNumber 
    })
    choicesContainer.insertAdjacentHTML('beforeend', choiceHTML)
  }
}

// This gathers all of the question data and sends it to the server
function collectAndSubmitQuiz() {

  // Quiz data from createQuiz.ejs
  var quizName = quizNameFromServer
  var quizSubject = quizSubjectFromServer
  var quizPhoto = quizPhotoFromServer

  // Questions array
  var questions = []

  // Get every question block from the DOM
  var questionElements = document.querySelectorAll('.question')

  // Loop through each question element
  questionElements.forEach(function (q) {

    // Read the type (text, single-choice, multi-choice)
    var type = q.dataset.type;

    // Read the question text
    var questionTextElem = q.querySelector('.question-text')
    var questionText = "";
    if (questionTextElem) {
      questionText = questionTextElem.value
    }

    /*
     * Validate question information (check that every question has text and at 
     * least one correct option)
     */

    // Check question text
    if (questionText === "") {
      alert("A question is missing its text. Please fill it in.")
      throw "Validation failed"
    }

    // ---- TEXT QUESTION VALIDATION ----
    if (type === "Text") {
      var answerElem = q.querySelector('.question-answer')

      // If element missing OR empty, fail
      if (!answerElem || !answerElem.value) {
        alert("A text question is missing an answer. Please fill it in.")
        throw "Validation failed"
      }

    // ---- SINGLE / MULTI CHOICE VALIDATION ----
    } else if (type === "Single-choice" || type === "Multi-choice") {

      var choiceElements = q.querySelectorAll('.choice')

      var numCorrect = 0

      for (var i = 0; i < choiceElements.length; i++) {
        var choiceElem = choiceElements[i]

        // Validate choice text
        var choiceTextElem = choiceElem.querySelector('.choice-text')

        if (!choiceTextElem || !choiceTextElem.value.trim()) {
          alert("A choice is missing text. Please fill it in.")
          throw "Validation failed"
        }

        // Check correctness
        if (type === "Single-choice") {
          var radio = choiceElem.querySelector('.choice-correct-radio')
          if (radio && radio.checked) {
            numCorrect++
          }
        } else {
          var checkbox = choiceElem.querySelector('.choice-correct-checkbox')
          if (checkbox && checkbox.checked) {
            numCorrect++
          }
        }
      }

      // Validate correctness rules
      if (type === "Single-choice" && numCorrect !== 1) {
        alert("A single-choice question must have exactly one correct answer.")
        throw "Validation failed"
      }

      if (type === "Multi-choice" && numCorrect === 0) {
        alert("A multi-choice question must have at least one correct answer.")
        throw "Validation failed"
      }
    }

    /*
     * Gather question information into a question obj
     */

    // ---- TEXT QUESTION ----
    if (type === "Text") {

      var answerElem = q.querySelector('.question-answer')
      var answer = "";
      if (answerElem) {
        answer = answerElem.value
      }

      var textQuestionObj = {
        type: "Text",
        question: questionText,
        answer: answer
      }

      questions.push(textQuestionObj)
    }

    // ---- SINGLE or MULTI-CHOICE ----
    else if (type === "Single-choice" || type === "Multi-choice") {

      // Gather all the choice rows
      var choiceElements = q.querySelectorAll('.choice')
      var choicesArray = []

      // Loop through each choice
      choiceElements.forEach(function (choiceElem) {

        // Read choice text
        var choiceTextElem = choiceElem.querySelector('.choice-text')
        var choiceText = ""
        if (choiceTextElem) {
          choiceText = choiceTextElem.value
        }

        // Determine if this choice is correct
        var isCorrect = false

        if (type === "Single-choice") {
          var radio = choiceElem.querySelector('.choice-correct-radio')
          if (radio && radio.checked) {
            isCorrect = true
          }
        } 
        else {
          var checkbox = choiceElem.querySelector('.choice-correct-checkbox')
          if (checkbox && checkbox.checked) {
            isCorrect = true
          }
        }

        // Build the choice object
        var choiceObj = {
          text: choiceText,
          correct: isCorrect
        }

        // Add to array
        choicesArray.push(choiceObj)
      })

      // Build the full question object
      var choiceQuestionObj = {
        type: type,
        question: questionText,
        choices: choicesArray
      }

      questions.push(choiceQuestionObj)
    }
  }
  )

  // ---- Build Quiz Object To Send To Server ----
  var quizData = {
    name: quizName,
    subject: quizSubject,
    photo: quizPhoto,
    questions: questions
  }

  // ---- SEND TO SERVER ----
  fetch("/createQuiz", {
    method: "POST",
    body: JSON.stringify(quizData),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (res) {

    if (res.status === 200) {
      // Redirect home
      window.location = "/"

      alert("Quiz information successfully saved!")
    } else {
      alert("An error occurred while saving the quiz.")
    }

  }).catch(function (err) {
    alert("An error occurred while sending the quiz.")
  })
}

// Attach button functionality after DOM content loaded
window.addEventListener('DOMContentLoaded', function () {
  var addQuestionButton = document.getElementById("add-question-button")
  addQuestionButton.addEventListener("click", addQuestionButtonClick)

  // Functionality for the remove question button
  document.body.addEventListener('click', function (event) {
    // If the clicked object contains the remove question class,
    if (event.target.classList.contains('remove-question-btn')) {

      // Get the question element closest to the button and remove it
      var questionElem = event.target.closest('.question')
      questionElem.remove()
      questionCounter--
    }
  })

  var submitQuestionButton = document.getElementById("submit-quiz-button")
  submitQuestionButton.addEventListener("click", collectAndSubmitQuiz)
})
