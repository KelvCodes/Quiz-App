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
const difficultySelect = document.getElementById("difficulty-select");
const startBtn = document.getElementById("start-btn");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const leaderboard = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");
const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");

let correctAnswer = "";
let correctScore = 0;
let currentQuestion = 0;
let totalQuestions = 10;
let selectedCategory = "";
let selectedDifficulty = "easy";
let timeLeft = 15;
let timerInterval;

startBtn.addEventListener("click", startQuiz);
checkAnswerBtn.addEventListener("click", checkAnswer);
nextQuestionBtn.addEventListener("click", loadNextQuestion);
playAgainBtn.addEventListener("click", restartGame);

function startQuiz() {
    selectedCategory = categorySelect.value;
    selectedDifficulty = difficultySelect.value;
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
        startTimer();
    }, 500);
}

function loadQuestion() {
    fetch(`https://opentdb.com/api.php?amount=1&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            const questionData = data.results[0];
            correctAnswer = questionData.correct_answer;
            let options = [...questionData.incorrect_answers, correctAnswer];
            options.sort(() => Math.random() - 0.5);

            questionEl.innerHTML = `${questionData.question} 
                <span class="category">(${questionData.category} - ${selectedDifficulty})</span>`;
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
            updateProgressBar();
            resetTimer();
        });
}

function checkAnswer() {
    const selectedOption = optionsList.querySelector(".selected");
    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }

    clearInterval(timerInterval);
    let userAnswer = selectedOption.textContent;
    if (userAnswer === correctAnswer) {
        correctScore += Math.max(1, Math.floor(timeLeft / 3));
        resultEl.innerHTML = `<i class="fas fa-check-circle"></i> Masterful!`;
        selectedOption.classList.add("correct");
        correctSound.play();
        animateScore();
    } else {
        resultEl.innerHTML = `<i class="fas fa-times-circle"></i> Not Quite! Correct answer: <b>${correctAnswer}</b>`;
        selectedOption.classList.add("incorrect");
        incorrectSound.play();
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

function startTimer() {
    timeLeft = 15;
    timerEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            resultEl.innerHTML = `<i class="fas fa-clock"></i> Time's Up! Correct answer: <b>${correctAnswer}</b>`;
            checkAnswerBtn.style.display = "none";
            nextQuestionBtn.style.display = "block";
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
}

function animateScore() {
    correctScoreEl.classList.add("score-bounce");
    setTimeout(() => correctScoreEl.classList.remove("score-bounce"), 600);
}

function updateProgressBar() {
    const progress = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
}

function endGame() {
    clearInterval(timerInterval);
    resultEl.innerHTML = `<h3 class="title-gradient">Challenge Conquered!</h3> Final Score: ${correctScore}/${totalQuestions * 5}`;
    resultEl.classList.add("result-slide");
    nextQuestionBtn.style.display = "none";
    playAgainBtn.style.display = "block";
    if (correctScore >= totalQuestions * 3) launchConfetti();
    saveToLeaderboard(correctScore);
}

function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8854C0', '#FF6F61', '#28a745']
    });
}

function saveToLeaderboard(score) {
    let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardData.push({ score, date: new Date().toLocaleDateString() });
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
}

function toggleLeaderboard() {
    leaderboard.style.display = leaderboard.style.display === "none" ? "block" : "none";
    if (leaderboard.style.display === "block") {
        const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboardList.innerHTML = leaderboardData
            .map((entry, i) => `<li>${i + 1}. Score: ${entry.score} - ${entry.date}</li>`)
            .join("");
    }
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
