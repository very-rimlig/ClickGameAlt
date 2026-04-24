// ====================
// Speldata
// ====================
let score = 0;
let timeLeft = 60;
let gameStarted = false;
let gameFinished = false;
let interval = null;

// ====================
// HTML-DOM
// ====================
const scoreButton = document.getElementById("scoreButton");
const submitButton = document.getElementById("button2");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const label = document.getElementById("label1");
const inputField = document.getElementById("inputName");
const scoreLabel = document.getElementById("scoreLabel");
const scoreList = document.getElementById("scoreList");

// ====================
// INIT-startläge
// ====================
inputField.style.display = "none";
label.style.display = "none";
submitButton.style.display = "none";

// ====================
// Events
// ====================
scoreButton.addEventListener("click", () => {
  if (gameFinished) return;

  if (!gameStarted) {
    startGame();
  }

  increaseScore();
});

submitButton.addEventListener("click", submitHighScore);

// ====================
// Spellogik
// ====================
function startGame() {
  gameStarted = true;
  interval = setInterval(countdown, 1000);
}

function increaseScore() {
  score++;
  scoreDisplay.innerText = score;
}

function countdown() {
  timeLeft--;
  timerDisplay.innerText = timeLeft;

  if (timeLeft <= 0) {
    timerDisplay.innerText = 0;
    endGame();
  }
}

function endGame() {
  gameFinished = true;
  clearInterval(interval);

  scoreLabel.innerText = "Dina poäng blev";
  scoreLabel.style.fontWeight = "bold";

  scoreButton.style.display = "none";
  inputField.style.display = "block";
  label.style.display = "block";
  submitButton.style.display = "block";
}

// ====================
// API - fetch
// ====================
async function submitHighScore() {
  const playerName = inputField.value.trim();

  if (playerName.length < 2) {
    alert("Ditt alias måste vara minst två tecken");
    return;
  }

  try {
    await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        name: playerName,
        score: score
      }),
    });

    alert("Ditt resultat är skickat");
    submitButton.disabled = true;
    submitButton.innerText = "Inskickat!";

  } catch (error) {
    console.error("Fel vid anrop:", error);
    alert("Något gick fel");
  }
}

// ====================
// API -get/fetch - SCOREBOARD
// ====================
fetch('https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec')
  .then(response => response.json())
  .then(renderScoreboard)
  .catch(error => console.error("Kunde inte ladda listan:", error));

function renderScoreboard(data) {
  if (!Array.isArray(data)) return;

  const cleanData = data
    .map(player => ({
      name: player.name?.trim() || "Anonym spelare",
      score: Number(player.score)
    }))
    .filter(player => player.score > 0 && !isNaN(player.score))
    .sort((a, b) => b.score - a.score);

  scoreList.innerHTML = "";

  cleanData.forEach(player => {
    const li = document.createElement("li");
    li.innerText = `${player.name}: ${player.score} poäng`;
    scoreList.appendChild(li);
  });
}
