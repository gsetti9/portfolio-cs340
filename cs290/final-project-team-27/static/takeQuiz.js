// handle quiz submission and grading
function handleQuizSubmit(event) {
  event.preventDefault()

  // get all questions
  var questions = document.querySelectorAll('.question')
  var totalQuestions = questions.length
  var correctAnswers = 0
  var results = []

  // loop through each question and check the answer
  questions.forEach(function(questionElem, index) {
    var questionType = questionElem.dataset.type
    var result = {
      questionNumber: index + 1,
      correct: false,
      userAnswer: null,
      correctAnswer: null
    }

    if (questionType === 'Text') {
      // handle text questions
      var textarea = questionElem.querySelector('textarea')
      var userAnswer = textarea.value.trim()
      var correctAnswer = questionElem.dataset.answer

      result.userAnswer = userAnswer
      result.correctAnswer = correctAnswer

      // check if answer is correct
      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        result.correct = true
        correctAnswers++
      }

    } else if (questionType === 'Single-choice') {
      // handle single choice questions
      var selectedRadio = questionElem.querySelector('input[type="radio"]:checked')
      
      if (selectedRadio) {
        var selectedIndex = parseInt(selectedRadio.value)
        result.userAnswer = selectedIndex

        // check if correct
        var correctIndex = parseInt(questionElem.dataset.correctAnswer)
        result.correctAnswer = correctIndex

        if (selectedIndex === correctIndex) {
          result.correct = true
          correctAnswers++
        }
      }

      // Ensure an answer is defined
      result.userAnswer = selectedIndex
      result.correctAnswer = parseInt(questionElem.dataset.correctAnswer)

    } else if (questionType === 'Multi-choice') {
      // handle multi-choice questions
      var selectedCheckboxes = questionElem.querySelectorAll('input[type="checkbox"]:checked')
      var userAnswers = []
      
      selectedCheckboxes.forEach(function(checkbox) {
        userAnswers.push(parseInt(checkbox.value))
      })

      result.userAnswer = userAnswers

      // get correct answers
      var correctAnswersStr = questionElem.dataset.correctAnswers
      var correctAnswersArray = JSON.parse(correctAnswersStr)
      result.correctAnswer = correctAnswersArray

      // check if arrays match 
      if (arraysMatch(userAnswers.sort(), correctAnswersArray.sort())) {
        result.correct = true
        correctAnswers++
      }
    }

    results.push(result)
  })

  // calculate percentage
  var percentage = Math.round((correctAnswers / totalQuestions) * 100)

  // display results
  displayResults(correctAnswers, totalQuestions, percentage, results)
}

// helper function to check if two arrays match
function arraysMatch(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

// Converts an index or array of indices into the visible text for that choice
function getChoiceText(questionElem, answerValue) {

  // Get all the <label> elements for this question
  var labels = questionElem.querySelectorAll("label");

  // Multi-choice (array of indices)
  if (Array.isArray(answerValue)) {

    // Create an empty array to hold the text versions
    var resultTexts = [];

    if (answerValue.length === 0) {
      resultTexts.push("No answer")
    }

    // Loop through every selected index
    for (var i = 0; i < answerValue.length; i++) {
      var index = answerValue[i]

      // Check if this index is valid
      if (index >= 0 && index < labels.length) {
        // Add the choice's text to the list
        resultTexts.push(labels[index].textContent)
      } else {
        // If index is wrong somehow
        resultTexts.push("(Invalid index)") 
      }
    }

    // Convert the array of strings into one comma-separated string
    var finalText = "";
    for (var j = 0; j < resultTexts.length; j++) {
      finalText += resultTexts[j]

      // Add comma + space between items
      if (j < resultTexts.length - 1) {
        finalText += ", "
      }
    }

    return finalText
  }

  // Single choice, with one index
  var idx = answerValue;

  if (idx === null || idx === undefined || idx === "") {
    return "No answer"
  }

  // Validate the index
  if (idx >= 0 && idx < labels.length) {
    return labels[idx].textContent
  }

  return "No answer"
}

// Returns text question from question index
function getQuestionText(questionNumber, questionElem) {
  // Find the paragraph that contains the question text
  var questionParagraph = questionElem.querySelector('p strong')
  
  if (questionParagraph && questionParagraph.parentElement) {
    // Get the full text of the paragraph
    var fullText = questionParagraph.parentElement.textContent
    
    // Remove the "Question X:" part to get just the question text
    // This regex removes "Question" followed by number and colon
    var questionText = fullText.replace(/^Question\s+\d+:\s*/, '').trim()
    
    return questionText
  }
  
  return "Question text not found"
}


// display the results to the user
function displayResults(correct, total, percentage, results) {
  // Hide the quiz form
  var quizContainer = document.getElementById('quiz-container')
  quizContainer.style.display = 'none'

  // show results container
  var resultsContainer = document.getElementById('results-container')
  resultsContainer.classList.remove('hidden')

  // set score text
  var scoreText = document.getElementById('score-text')
  scoreText.textContent = 'You got ' + correct + ' out of ' + total + ' correct (' + percentage + '%)'

  // add grade message
  var gradeMessage = document.getElementById('grade-message')
  if (percentage >= 90) {
    gradeMessage.textContent = 'Excellent work!'
    gradeMessage.style.color = '#2ecc71'
  } else if (percentage >= 70) {
    gradeMessage.textContent = 'Good job!'
    gradeMessage.style.color = '#3498db'
  } else if (percentage >= 50) {
    gradeMessage.textContent = 'Not bad, but you can do better!'
    gradeMessage.style.color = '#f39c12'
  } else {
    gradeMessage.textContent = 'Keep studying and try again!'
    gradeMessage.style.color = '#e74c3c'
  }

  // show detailed results
  var detailsList = document.getElementById('details-list')
  results.forEach(function(result) {
    var li = document.createElement('li')
    li.className = 'result-item'

    // Build question header (correct  / incorrect marking)
    var header = document.createElement('div')
    header.className = 'result-header'

    // Create arrow element
    var arrow = document.createElement('span')
    arrow.className = 'arrow'
    arrow.textContent = '▶'

    // Create the label text
    var label = document.createElement('span')
    
    if (result.correct) {
      label.innerHTML = '<strong>Question ' + result.questionNumber + ':</strong> ✓ Correct'
      header.style.color = '#2ecc71'
    } else {
      label.innerHTML = '<strong>Question ' + result.questionNumber + ':</strong> ✗ Incorrect'
      header.style.color = '#e74c3c'
    }

    // Append arrow + label
    header.appendChild(arrow)
    header.appendChild(label)

    // Details section, for given and correct answers
    var details = document.createElement('div')
    details.className = 'result-details hidden'

    // Grab question element
    var questionElem = document.querySelectorAll(".question")[result.questionNumber - 1]

    // Format answers
    var userAnswerFormatted, correctAnswerFormatted

    if (questionElem.dataset.type === "Text") {
        // Text question
        userAnswerFormatted = result.userAnswer || "No answer"
        correctAnswerFormatted = result.correctAnswer
    } else {
        // Choice questions (single or multi)
        userAnswerFormatted = getChoiceText(questionElem, result.userAnswer)
        correctAnswerFormatted = getChoiceText(questionElem, result.correctAnswer)
    }
    

    // Build details innerHTML
    var detailsHTML = ""

    // Gather question text and HTML
    var questionNumber = parseInt(questionElem.dataset.questionNumber)
    var questionText = getQuestionText(questionNumber, questionElem)

    detailsHTML += "<p><strong>Question:</strong> <span class='question-text'></span></p>"
    

    // Build user and correct answer details
    detailsHTML += "<p><strong>Your answer:</strong> <span class='user-answer'></span></p>"
    detailsHTML += "<p><strong>Correct answer:</strong> <span class='correct-answer'></span></p>"

    details.innerHTML = detailsHTML

    // Append question / answers
    details.querySelector('.question-text').textContent = questionText
    details.querySelector('.user-answer').textContent = userAnswerFormatted
    details.querySelector('.correct-answer').textContent = correctAnswerFormatted

    // Add toggle visibility
    header.addEventListener('click', function() {
      var isHidden = details.classList.contains("hidden")

      if (isHidden) {
        details.classList.remove("hidden")
        arrow.classList.add("open")
      } else {
        details.classList.add("hidden")
        arrow.classList.remove("open")
      }
    });
    
    li.appendChild(header)
    li.appendChild(details)
    detailsList.appendChild(li)
  })
}

// retake quiz functionality
function handleRetakeQuiz() {
  // show quiz container
  var quizContainer = document.getElementById('quiz-container')
  quizContainer.style.display = 'block'

  // hide results
  var resultsContainer = document.getElementById('results-container')
  resultsContainer.classList.add('hidden')

  // clear all answers
  var textareas = document.querySelectorAll('textarea')
  textareas.forEach(function(textarea) {
    textarea.value = ''
  })

  var radios = document.querySelectorAll('input[type="radio"]')
  radios.forEach(function(radio) {
    radio.checked = false
  })

  var checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false
  })

  // clear results details
  var detailsList = document.getElementById('details-list')
  detailsList.innerHTML = ''

}

// set up event listeners when page loads
window.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submit-quiz-button')
  if (submitButton) {
    submitButton.addEventListener('click', handleQuizSubmit)
  }

  var retakeButton = document.getElementById('retake-quiz-button')
  if (retakeButton) {
    retakeButton.addEventListener('click', handleRetakeQuiz)
  }

  var homeButton = document.getElementById('home-button')
  if (homeButton) {
    homeButton.addEventListener('click', function() {
      window.location.href = '/'
    })
  }
})