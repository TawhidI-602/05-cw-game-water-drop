// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly

// Added Variables for score, timer, and three different message variables to display different messages based on the player's performance
let score = 0;
let timeLeft = 30;
let timerInterval;

// Added message arrays based on win or lose conditions
const winMessages = [
  "Great job! You're a water-catching pro!",
  "Awesome! You caught all the drops!",
  "Fantastic! You're a water drop master!"
];

const loseMessages = [
  "Oh no! The drops got away!",
  "Better luck next time! Try to catch more drops!",
  "Don't give up! Keep practicing to catch those drops!"
];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

// Wait for button click to reset the game
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Added Reset score and timer
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("endMessage").textContent = ``;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Added Timer countdown every second
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

    // When time runs out, end the game
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Added end game function to stop the game and display win/lose messages based on score
function endGame() {
  gameRunning = false;
  clearInterval(dropMaker); // Stop creating new drops
  clearInterval(timerInterval); // Stop the timer
  showEndMessage(); // Show win/lose message based on score
}

// Added function to show random messages based on player's performance
function showEndMessage() {
  const endMessage = document.getElementById("endMessage");
  if (score >= 10) {
    endMessage.textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4FCB53', '#F5402C', '#FFD700', '#00BFFF', '#FF69B4']
    });
  } else {
    endMessage.textContent = loseMessages[Math.floor(Math.random() * loseMessages.length)];
  }
}

// Added Reset function
function resetGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  document.querySelectorAll(".water-drop").forEach(drop => drop.remove());

  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("endMessage").textContent = ``;

}


function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  const evilDrop = Math.random() < 0.3;
  drop.className = evilDrop ? "water-drop evil-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  //Added click listener to increase score and remove drop when clicked
  drop.addEventListener("click", () => {
    if (!gameRunning) return; // Ignore clicks if game isn't running
    const scoreFlash = document.getElementById("score");

    if (evilDrop) {
      score--;
      scoreFlash.style.color = "#F5402C";
    } else {
      score++;
      scoreFlash.style.color = "#4FCB53";
    }

    setTimeout(() => scoreFlash.style.color = "", 300);
    document.getElementById("score").textContent = score;
    drop.remove(); // Remove the drop when clicked
  });


  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
