// Create a Quiz button click
function handleMakeQuizClick(event){
    var button = event.target
    var modalBackdrop = document.getElementById("modal-backdrop")
    modalBackdrop.classList.remove("hidden")
    var makeQuizModal = document.getElementById("make-quiz-modal")
    makeQuizModal.classList.remove("hidden")
  }
  
  // Clears values from create a quiz modal window
  function clearModal(event) {
    document.getElementById('quiz-text-input').value = ""
    document.getElementById('quiz-photo-input').value = ""
    document.getElementById('post-subject-input').value = ""
  }
  
  // Toggles the hidden class for the create a quiz modal
  function toggleHiddenModal(event) {
    var modalBackdrop = document.getElementById("modal-backdrop")
    modalBackdrop.classList.toggle("hidden")
    var makeQuizModal = document.getElementById("make-quiz-modal")
    makeQuizModal.classList.toggle("hidden")
  }
  
  // Close modal [X] button
  function handleCloseModalClick(event) {
    var button = event.target
    toggleHiddenModal()
  
    // Reset values here when we add all of them!
    clearModal()
  }
  
  // Handles create quiz button click
  function handleBeginCreationClick(event) {
    var name = document.getElementById("quiz-text-input").value
    var photo = document.getElementById("quiz-photo-input").value
    var subject = document.getElementById("post-subject-input").value
  
    // If each bit of information exists,
    if (name && photo && subject) {
  
      // Create a url to visit the quiz creation page
      // URL encode given info to avoid spaces breaking URLs
      var url = "/createQuiz?name=" + encodeURIComponent(name)
              + "&photo=" + encodeURIComponent(photo)
              + "&subject=" + encodeURIComponent(subject)
  
      // Hide modal window
      toggleHiddenModal()
  
      // Reset values
      clearModal()
  
      // Navigate to the constructed url
      window.location.href = url
  
    }
    else {
      alert("Please enter necessary information before creating a quiz.")
    }
  }
  
  
  
  
  window.addEventListener('DOMContentLoaded', function () {
    // Attatch functionality to each button
    var makeQuizButton = document.getElementById("make-quiz-button")
    makeQuizButton.addEventListener("click", handleMakeQuizClick)
  
    var closeMakeQuizButton = document.getElementById("modal-close")
    closeMakeQuizButton.addEventListener("click", handleCloseModalClick)
  
    var closeMakeQuizButton = document.getElementById("begin-creation-button")
    closeMakeQuizButton.addEventListener("click", handleBeginCreationClick)
  
  })