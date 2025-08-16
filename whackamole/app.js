//  DOM variables
const squares = document.querySelectorAll('.square');
const scoreDisplay = document.getElementById('score');
const timer = document.getElementById('timer');
const startBtn = document.getElementById('start');
const playPauseBtn = document.getElementById('play-pause-btn');
const finalResult = document.getElementById('results-score');
const playAgainBtn = document.getElementById('play-again');

// game variables
let randomId;
let score = 0;
let currentTime = 30;
let moveId;
let countdownTimer;
let moleHit = false; // flag to prevent multiple clicks on the same mole
let isPlaying = false;

// other variables
const gameOverAudio = new Audio('./audio/game-over.mp3');
const backgroundMusic = new Audio('./audio/background-music.wav'); 
gameOverAudio.volume = 1;

// game
startBtn.addEventListener('click', showGameboard);

function showGameboard() {
  toggleVisibility(document.querySelector('.intro'));
  toggleVisibility(document.querySelector('.game'));
}

function randomSquare() {
  // remove previous mole if present
  const mole = document.querySelector('.mole');
  if (mole) mole.classList.remove('mole');
  
  // generate random mole
  randomId = Math.floor(Math.random() * squares.length);
  squares[randomId].classList.add('mole');
  moleHit = false; 
}

function move() {
  moveId = setInterval(randomSquare, 600); // generate new mole every .6s
  return moveId;
}

function handleSquareClick(square) {
  if (square.id == randomId && !moleHit) {
    score++;
    displayScore();
    moleHit = true; // this prevents multiple points for the same mole
  }
}

// support for mouse
squares.forEach(square => {
  square.addEventListener('mousedown', () => handleSquareClick(square));
})

// support for touchscreens
squares.forEach(square => {
  square.addEventListener('touchstart', () => handleSquareClick(square));
})

function countdown() {
  displayTime();
  currentTime--;
  
  if (currentTime < 0) {
    gameOver();
  }
}
 
function gameOver() {
  clearInterval(countdownTimer);
  clearInterval(moveId);   

  setTimeout(() => {
    toggleVisibility(document.querySelector('.game-over'));
    gameOverAudio.play();
    finalResult.textContent = score;
    toggleVisibility(document.querySelector('.backdrop'));
  }, 1000)
  
}


playPauseBtn.addEventListener('click', () => {
  handleGameState();
  isPlaying = !isPlaying; 

})

function handleGameState() {
  if (!isPlaying) {
    move();
    countdownTimer  = setInterval(countdown, 1000);
    playPauseBtn.textContent = 'pause';
  } else {
    playPauseBtn.textContent = 'play';
    clearInterval(countdownTimer);
    clearInterval(moveId);
  }
  
} 

// restart

playAgainBtn.addEventListener('click', restart);

function restart() {
  resetGame();
  toggleVisibility(document.querySelector('.game-over'));
  toggleVisibility(document.querySelector('.backdrop'));
  handleGameState();  
}

function resetGame() {
  currentTime = 30;
  moleHit = false;
  score = 0;
  isPlaying = false;
  displayScore();
  displayTime();
}

// audio settings
function toggleAudio(audio) {
  if (audio.paused) {
    audio.volume = 0.3;
    audio.play();
    toggleClass(document.getElementById('audio-btn'), 'playing');
    toggleClass(document.getElementById('audio-btn'), 'paused');
    audio.loop = true;
  } else {
    audio.pause();
    toggleClass(document.getElementById('audio-btn'), 'playing');
    toggleClass(document.getElementById('audio-btn'), 'paused');
  }
}

document.getElementById('audio-btn').addEventListener('click', () => toggleAudio(backgroundMusic));

// utility functions

function toggleVisibility(element) {
  element.classList.toggle('hide');
}


function displayScore() {
  scoreDisplay.textContent = score;
}

function displayTime() {
  timer.textContent = currentTime;
}

function toggleClass(element, className) {
 element.classList.toggle(className); 
}