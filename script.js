.classList.add("score-bounce");
    setTimeout(() => correctScoreEl.classList.remove("score-bounce"), 600);
}tn.style.display = "block";
}

function restartGame() {
    correc => {
        quizContainer.style.display = "none";
        startScreen.style.display = "block";
        startScreen.classList.remove("fade-out");
        startScreen.classList.add("fade-in");
        categorySelect.value = "";
    }, 500);
}
