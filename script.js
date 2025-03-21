const questionEl = document.getElementById("question");
const optionsList = document.querySelector(".quiz-options");
const checkAnswerBtn = document.getElementById("check-answer");
const nextQuestionBtn = document.getElementById("next-question");
const playAgainBtn = document.getElementById("play-again");
const correctScoreEl = document.getElementById("correct-score");
const totalQuestionEl = document.getElementById("total-question");
const currentQuestionEl = document.getElementById("current-question");
const resultEl = document.getElementById("result");
const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const categorySelect = document.getElementById("category-select");
const startBtn = document.getElementById("start-btn");

let correctAnswer = "";
let correctScore = 0;
let currentQuestion = 0;
let totalQuestions = 10;
let selectedCategory = "";

startBtn.addEventListener("click", startQuiz);
checkAnswerBtn.addEventListener("click", checkAnswer);
nextQuestionBtn.addEventListener("click", loadNextQuestion);
playAgainBtn.addEventListener("click", restartGame);

function startQuiz() {
    selectedCategory = categorySelect.value;
    if (!selectedCategory) {
        alert("Please select a category!");
        return;
    }
    startScreen.classList.add("fade-out");
    setTimeout(() => {
        startScreen.style.display = "none";
        quizContainer.style.display = "block";
        quizContainer.classList.add("fade-in");
        loadQuestion();
    }, 500);
}

function loadQuestion() {
    fetch(`https://opentdb.com/api.php?amount=1&category=${selectedCategory}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            const questionData = data.results[0];
            correctAnswer = questionData.correct_answer;
            let options = [...questionData.incorrect_answers, correctAnswer];
            options.sort(() => Math.random() - 0.5);

            questionEl.innerHTML = `${questionData.question} 
                <span class="category">(${questionData.category})</span>`;
            optionsList.innerHTML = options
                .map(option => `<li class="option-slide">${option}</li>`)
                .join("");

            optionsList.querySelectorAll("li").forEach((option, index) => {
                option.style.animationDelay = `${index * 0.1}s`;
                option.addEventListener("click", () => {
                    optionsList.querySelectorAll("li").forEach(li => li.classList.remove("selected"));
                    option.classList.add("selected");
                });
            });
            currentQuestionEl.textContent = currentQuestion + 1;
        });
}

function checkAnswer() {
    const selectedOption = optionsList.querySelector(".selected");
    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }

    let userAnswer = selectedOption.textContent;
    if (userAnswer === correctAnswer) {
        correctScore++;
        resultEl.innerHTML = `<i class="fas fa-check-circle"></i> Brilliant!`;
        selectedOption.classList.add("correct");
        animateScore();
    } else {
        resultEl.innerHTML = `<i class="fas fa-times-circle"></i> Oops! Correct answer: <b>${correctAnswer}</b>`;
        selectedOption.classList.add("incorrect");
    }

    resultEl.classList.add("result-slide");
    checkAnswerBtn.style.display = "none";
    nextQuestionBtn.style.display = "block";
    correctScoreEl.textContent = correctScore;
}

function loadNextQuestion() {
    currentQuestion++;
    if (currentQuestion >= totalQuestions) {
        endGame();
        return;
    }
    resultEl.classList.remove("result-slide");
    resultEl.textContent = "";
    checkAnswerBtn.style.display = "block";
    nextQuestionBtn.style.display = "none";
    quizContainer.classList.add("fade-out");
    setTimeout(() => {
        quizContainer.classList.remove("fade-out");
        quizContainer.classList.add("fade-in");
        loadQuestion();
    }, 500);
}

function animateScore() {
    correctScoreEl.classList.add("score-bounce");
    setTimeout(() => correctScoreEl.classList.remove("score-bounce"), 600);
}

function endGame() {
    resultEl.innerHTML = `<h3 class="title-gradient">Quiz Complete!</h3> Final Score: ${correctScore}/${totalQuestions}`;
    resultEl.classList.add("result-slide");
    nextQuestionBtn.style.display = "none";
    playAgainBtn.style.display = "block";
}

function restartGame() {
    correctScore = 0;
    currentQuestion = 0;
    correctScoreEl.textContent = correctScore;
    resultEl.textContent = "";
    quizContainer.classList.add("fade-out");
    setTimeout(() => {
        quizContainer.style.display = "none";
        startScreen.style.display = "block";
        startScreen.classList.remove("fade-out");
        startScreen.classList.add("fade-in");
        categorySelect.value = "";
    }, 500);
}