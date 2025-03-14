const gameState = {
  player1: null,
  player2: null,
  isProcessing: false,
  round: 1,
  score: { player1: 0, player2: 0 },
  countdownActive: false,
};

const keyMappings = {
  q: "Rock",
  w: "Paper",
  e: "Scissors",
  i: "Rock",
  o: "Paper",
  p: "Scissors",
};

function startCountdown() {
  if (gameState.countdownActive) return;
  gameState.countdownActive = true;
  let count = 3;
  const countdownEl = document.getElementById("countdown");
  countdownEl.textContent = count;
  countdownEl.style.color = "black";

  const interval = setInterval(() => {
    count--;
    countdownEl.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      countdownEl.textContent = "Go!";
      countdownEl.style.color = "green";
      setTimeout(() => {
        countdownEl.textContent = "";
      }, 1000);
      gameState.countdownActive = false;
      enableChoices();
    }
  }, 1000);
}

function enableChoices() {
  document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
  const key = event.key.toLowerCase();
  if (key in keyMappings && !gameState.isProcessing) {
    event.preventDefault();

    if (["q", "w", "e"].includes(key)) {
      gameState.player1 = keyMappings[key];
    } else {
      gameState.player2 = keyMappings[key];
    }

    if (gameState.player1 && gameState.player2) {
      document.removeEventListener("keydown", handleKeyPress);
      processRound();
    }
  }
}

function processRound() {
  gameState.isProcessing = true;
  const winner = determineWinner(gameState.player1, gameState.player2);
  showResult(winner);
  updateScore(winner);
  setTimeout(() => {
    if (gameState.round < 3) {
      gameState.round++;
      resetRound();
      startCountdown();
    } else {
      showFinalResult();
    }
  }, 2000);
}

function determineWinner(p1Choice, p2Choice) {
  if (p1Choice === p2Choice) return "draw";
  const winningConditions = {
    Rock: "Scissors",
    Paper: "Rock",
    Scissors: "Paper",
  };
  return winningConditions[p1Choice] === p2Choice ? "Player 1" : "Player 2";
}

function showResult(winner) {
  document.getElementById("p1-choice").textContent = gameState.player1;
  document.getElementById("p2-choice").textContent = gameState.player2;
  const resultElement = document.getElementById("result");
  resultElement.textContent =
    winner === "draw" ? "It's a draw!" : `${winner} wins!`;
  resultElement.style.color = winner === "Player 1" ? "#009900" : "#0000cc";
}

function updateScore(winner) {
  if (winner === "Player 1") gameState.score.player1++;
  if (winner === "Player 2") gameState.score.player2++;
  document.getElementById("p1-score").textContent = gameState.score.player1;
  document.getElementById("p2-score").textContent = gameState.score.player2;
}

function resetRound() {
  gameState.player1 = null;
  gameState.player2 = null;
  gameState.isProcessing = false;
  document.getElementById("p1-choice").textContent = "...";
  document.getElementById("p2-choice").textContent = "...";
  document.getElementById("result").textContent = "";
}

function showFinalResult() {
  const resultText =
    gameState.score.player1 > gameState.score.player2
      ? "Player 1 Wins the Game!"
      : gameState.score.player1 < gameState.score.player2
      ? "Player 2 Wins the Game!"
      : "It's a Tie!";
  document.getElementById("result").textContent = resultText;
}

startCountdown();
