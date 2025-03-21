.classList.add("score-bounce");
    setTimeout(() => correctScoreEl.classList.remove("score-bounce"), 600);
}tn.style.display = "block";
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
