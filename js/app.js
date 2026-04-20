//Varibler
let score = 0;
let timeLeft = 5;
let GameStarted = false;
let GameFinished = false;
let interval = null;

//HTML DOM
const scoreButton = document.getElementById("scoreButton");
const button2 = document.getElementById("button2");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const label1 = document.getElementById("label1");
const inputField = document.getElementById("inputName");

//UI functions and events
scoreButton.addEventListener("click", () => {
  if(!GameFinished) {
    increaseScore();
  }
  if(!GameStarted) {
    startGame();
  }
})
button2.addEventListener("click", () => {
  submitHighScore();
})
inputField.style.display="none";
label1.style.display="none";
button2.style.display="none";

//Functions
function startGame() {
  interval = setInterval(countdown, 1000);
  GameStarted = true;
}
function increaseScore() {
  score++;
  scoreDisplay.innerText = score;
}
function endGame() {
  GameFinished = true;
  clearInterval(interval);
  scoreButton.style.display = "none";
  inputField.style.display = "block";
  label1.style.display="block";
  button2.style.display = "block";

}
function countdown()  {
  timeLeft--;
  timerDisplay.innerText = timeLeft;
  if (timeLeft <= 0) {
    timerDisplay.innerText = 0;
    endGame();

  }
}
async function submitHighScore() {
  const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
    method: "POST",
    body: JSON.stringify({ name: inputField.value, score: score }),
  });
  console.log(response);
}

/*
const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
  method: "POST",
  body: JSON.stringify({ name: "Jossan", score: 140 }),
});
console.log(response);
*/

//GET-request
const url = 'https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec';

fetch(url)
  .then(response => {
    console.log('Response object:', response);
    return response.json();
  })
  .then(data => {
    console.log('Scoreboard data:', data);

    data.forEach((player, index) => {
      console.log(`Row ${index + 1}: Name=${player.name}, Score=${player.score}`);
    });
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
