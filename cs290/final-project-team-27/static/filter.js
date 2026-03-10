function filterQuizzesBySubject(quiz, selectedSubject) {
    var quizSubject = quiz.getAttribute("subject")
    if (quizSubject == selectedSubject) {
        quiz.style.display = "block"
    } else {
        quiz.style.display = "none"
    }
}

function filterQuizzesByMaxNumQuestions(quiz, maxNumQuestionsInput, filterSubjectName) {
    var filterMaxNumQuestions = parseInt(maxNumQuestionsInput.value)
    var quizNumQuestions = parseInt(quiz.getAttribute("num-questions"))
    if (quizNumQuestions <= filterMaxNumQuestions) {
        if (filterSubjectName != "") {
            filterQuizzesBySubject(quiz, filterSubjectName)
        } else {
            quiz.style.display = "block"
        }
    } else {
        quiz.style.display = "none"        
    }
}

function filterQuizzesByMinNumQuestions(quiz, minNumQuestionsInput, filterSubjectName) {
    var filterMinNumQuestions = parseInt(minNumQuestionsInput.value)
    var quizNumQuestions = parseInt(quiz.getAttribute("num-questions"))
    if (quizNumQuestions >= filterMinNumQuestions) {
        if (filterSubjectName != "") {
            filterQuizzesBySubject(quiz, filterSubjectName)
        } else {
            quiz.style.display = "block"
        }
    } else {
        quiz.style.display = "none"        
    }
}

function filterQuizzesByNumQuestions(quiz, minNumQuestionsInput, maxNumQuestionsInput, filterSubjectName) {
    var filterMinNumQuestions = parseInt(minNumQuestionsInput.value)
    var filterMaxNumQuestions = parseInt(maxNumQuestionsInput.value)
    var quizNumQuestions = parseInt(quiz.getAttribute("num-questions"))

    if (quizNumQuestions >= filterMinNumQuestions && quizNumQuestions <= filterMaxNumQuestions) {
        if (filterSubjectName != "") {
            filterQuizzesBySubject(quiz, filterSubjectName)
        } else {
            quiz.style.display = "block"
        }
    } else {
        quiz.style.display = "none"        
    }
}

function filterQuizzes(quiz, quizTitle, quizTitleInput, minNumQuestionsInput, maxNumQuestionsInput, filterSubjectName) {
    var filterTitleText = quizTitleInput.replace(/[!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~]/g, '')
    filterTitleText = filterTitleText.toLowerCase()
    filterTitleText = filterTitleText.trim()
    
    var quizTitleText = quizTitle.toLowerCase()
    
    var titleMatches = quizTitleText.includes(filterTitleText)
    
    if (titleMatches) {
        if (minNumQuestionsInput.value.length != 0 && maxNumQuestionsInput.value.length != 0) {
            filterQuizzesByNumQuestions(quiz, minNumQuestionsInput, maxNumQuestionsInput, filterSubjectName)
        } else if (minNumQuestionsInput.value.length != 0 && maxNumQuestionsInput.value.length == 0) {
            filterQuizzesByMinNumQuestions(quiz, minNumQuestionsInput, filterSubjectName)
        } else if (minNumQuestionsInput.value.length == 0 && maxNumQuestionsInput.value.length != 0) {
            filterQuizzesByMaxNumQuestions(quiz, maxNumQuestionsInput, filterSubjectName)
        } else if (filterSubjectName != "") {
            filterQuizzesBySubject(quiz, filterSubjectName)
        } else {
            quiz.style.display = "block"
        }
    } else {
        quiz.style.display = "none"
    }
}

function handleFilterUpdateButtonClick(event) {
    var quizzes = document.getElementsByClassName("quiz")
    var quizTitles = document.getElementsByClassName("quiz-title")

    var quizTitleInput = document.getElementById("search-input")
    var minNumQuestionsInput = document.getElementById("filter-min-questions")
    var maxNumQuestionsInput = document.getElementById("filter-max-questions")
    var selectedSubject = document.getElementById("filter-subject")
    var filterSubjectName = selectedSubject.value

    for (var i = 0; i < quizzes.length; i++) {
        if (quizTitleInput.value.length != 0) {
            var titleText = quizTitles[i].textContent.replace("Title: ", "")
            filterQuizzes(quizzes[i], titleText, quizTitleInput.value, minNumQuestionsInput, maxNumQuestionsInput, filterSubjectName)
            continue
        } else if (minNumQuestionsInput.value.length != 0 && maxNumQuestionsInput.value.length != 0) {
            filterQuizzesByNumQuestions(quizzes[i], minNumQuestionsInput, maxNumQuestionsInput, filterSubjectName)
            continue
        } else if (minNumQuestionsInput.value.length != 0 && maxNumQuestionsInput.value.length == 0) {
            filterQuizzesByMinNumQuestions(quizzes[i], minNumQuestionsInput, filterSubjectName)
            continue
        } else if (minNumQuestionsInput.value.length == 0 && maxNumQuestionsInput.value.length != 0) {
            filterQuizzesByMaxNumQuestions(quizzes[i], maxNumQuestionsInput, filterSubjectName)
            continue
        } else if (filterSubjectName != "") {
            filterQuizzesBySubject(quizzes[i], filterSubjectName)
            continue
        } else {
            quizzes[i].style.display = "block"
        }
    }
}


window.addEventListener('DOMContentLoaded', function() {
    var filterUpdateButton = document.getElementById("filter-update-button")
    if (filterUpdateButton) {
        filterUpdateButton.addEventListener("click", handleFilterUpdateButtonClick)
    }
})