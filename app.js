// Global state
let currentCategory = null;
let currentQuestion = 0;
let answers = [];
let timeRemaining = 300; // 5 minutes in seconds
let timerInterval = null;
let isQuizComplete = false;

// DOM Elements
const categoriesScreen = document.getElementById('categories-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const categoriesGrid = document.getElementById('categories-grid');
const quizTitle = document.getElementById('quiz-title');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionProgress = document.getElementById('question-progress');
const timerElement = document.getElementById('timer');

// Initialize the application
function init() {
  renderCategories();
}

// Render category cards
function renderCategories() {
  categoriesGrid.innerHTML = categories
    .map(
      category => `
        <button class="category-card" onclick="startQuiz('${category.id}')">
          <div class="category-content">
            <div class="category-icon">${category.icon}</div>
            <div class="category-info">
              <h3>${category.name}</h3>
              <p>${category.description}</p>
            </div>
          </div>
        </button>
      `
    )
    .join('');
}

// Start quiz for selected category
function startQuiz(categoryId) {
  currentCategory = categoryId;
  currentQuestion = 0;
  answers = [];
  timeRemaining = 300;
  isQuizComplete = false;

  // Update UI
  categoriesScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  resultsScreen.classList.add('hidden');

  // Set quiz title
  const category = categories.find(c => c.id === categoryId);
  quizTitle.textContent = category.name;

  // Start timer
  startTimer();

  // Render first question
  renderQuestion();
}

// Render current question
function renderQuestion() {
  const categoryQuestions = questions.filter(q => q.category === currentCategory);
  const question = categoryQuestions[currentQuestion];

  questionText.textContent = question.question;
  
  optionsContainer.innerHTML = question.options
    .map(
      (option, index) => `
        <button
          class="option-button"
          onclick="selectAnswer(${index})"
        >${option}</button>
      `
    )
    .join('');

  questionProgress.textContent = 
    `Question ${currentQuestion + 1} of ${categoryQuestions.length}`;
}

// Handle answer selection
function selectAnswer(answerIndex) {
  const categoryQuestions = questions.filter(q => q.category === currentCategory);
  const question = categoryQuestions[currentQuestion];
  
  answers[currentQuestion] = answerIndex;

  // Update UI to show selected answer
  const options = optionsContainer.querySelectorAll('.option-button');
  options.forEach((option, index) => {
    option.classList.remove('selected');
    if (index === answerIndex) {
      option.classList.add('selected');
    }
  });

  // Disable all options after selection
  options.forEach(option => option.disabled = true);

  // Show correct/incorrect feedback
  options.forEach((option, index) => {
    if (index === question.correctAnswer) {
      option.classList.add('correct');
    } else if (index === answerIndex && index !== question.correctAnswer) {
      option.classList.add('incorrect');
    }
  });

  // Show explanation
  const explanation = document.createElement('div');
  explanation.className = 'explanation';
  explanation.textContent = question.explanation;
  optionsContainer.appendChild(explanation);

  // Move to next question or show results after a delay
  setTimeout(() => {
    if (currentQuestion < categoryQuestions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      completeQuiz();
    }
  }, 2000);
}

// Start timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      completeQuiz();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerElement.textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Complete quiz and show results
function completeQuiz() {
  clearInterval(timerInterval);
  isQuizComplete = true;

  const categoryQuestions = questions.filter(q => q.category === currentCategory);
  const correctAnswers = answers.reduce((acc, answer, index) => 
    answer === categoryQuestions[index].correctAnswer ? acc + 1 : acc, 0
  );

  // Update results screen
  document.getElementById('score-percentage').textContent = 
    `${Math.round((correctAnswers / categoryQuestions.length) * 100)}%`;
  document.getElementById('total-questions').textContent = 
    categoryQuestions.length;
  document.getElementById('correct-answers').textContent = correctAnswers;
  document.getElementById('time-spent').textContent = 
    `${Math.floor((300 - timeRemaining) / 60)}m ${(300 - timeRemaining) % 60}s`;

  // Show results screen
  quizScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');
}

// Restart quiz
function restartQuiz() {
  currentCategory = null;
  currentQuestion = 0;
  answers = [];
  timeRemaining = 300;
  isQuizComplete = false;
  
  if (timerInterval) clearInterval(timerInterval);

  // Show categories screen
  categoriesScreen.classList.remove('hidden');
  quizScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');
}

// Initialize the application
init();