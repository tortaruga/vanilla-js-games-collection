// DOM variables
const gameBoard = document.querySelector('.gameboard');
const replayBtn = document.querySelector('.replay-btn');
const popup = document.querySelector('.popup');
const scoreDisplay = document.querySelector('.score');
const playBtn = document.getElementById('play-btn');

const directionBtns = document.querySelectorAll('.phone-controls button');
const up = document.querySelector('.up');
const left = document.querySelector('.left');
const right = document.querySelector('.right');
const down = document.querySelector('.down');

// other variables
const gameOverAudio = new Audio('./audio/game-over.mp3');
const backgroundMusic = new Audio('./audio/music.wav');
const appleColors = ['green', 'dark-green', 'brown', 'red', 'dark-red']; 

let boardWidth = 20;
let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = .9;
let intervalTime = 0;
let interval = 0;


// starting game
function createGrid() {
  // create boardgame cells
  for (let i = 0; i < boardWidth * boardWidth; i++) {
    let div = document.createElement('div');
    gameBoard.appendChild(div);
  }
}

playBtn.addEventListener('click', () => {
  toggleVisibility(document.querySelector('.intro'));
  toggleVisibility(document.querySelector('.game-container'));
  toggleVisibility(document.querySelector('footer'));

  startGame();
})

function startGame() {
  let squares = document.querySelectorAll('.gameboard div');
  
  direction = 1;
  currentSnake = [2, 1, 0]; // indexes of the first 3 squares
  currentSnake.forEach(index => squares[index].classList.add('snake'));
  randomApple(squares);
  
  resetGameVariables();
  // keep moving snake every intervalTime ms
  interval = setInterval(moveOutcome, intervalTime);
}

function randomApple(squares) {
  // choose random square to be the apple (among those not taken by the snake)
  do {
    appleIndex = Math.floor(Math.random() * squares.length)
  } while (squares[appleIndex].classList.contains('snake'));
 
  squares[appleIndex].classList.add('apple'); // style the chosen square as apple
  
  // chose a random color for the apple 
  const randomIndex = Math.floor(Math.random() * appleColors.length);
  squares[appleIndex].classList.add(appleColors[randomIndex]);
}

function moveOutcome() {
  let squares = document.querySelectorAll('.gameboard div');

  // check if snake hit something it shouldn't have
  if (checkForHits(squares)) {
    gameOver();
    return clearInterval(interval);  // stop moving snake
  } else {
    moveSnake(squares);
  }  
}

function checkForHits(squares) {
  if (
    // if user selected down and snak's head is in the last row of board
    (currentSnake[0] + boardWidth >= boardWidth * boardWidth && direction === boardWidth) ||       
    // if user selected left and snake's head is on last column of board
    // (all indexes of the squares of last column divided by boardWidth give boardWidth - 1 as remainder)
    (currentSnake[0] % boardWidth === boardWidth - 1 && direction === 1) ||
    // if user selected right and the snake's head is in the first column of board
    // (all indexes of squares in first column divided by boardWidth give 0 as remainder)
    (currentSnake[0] % boardWidth === 0 && direction === -1) ||
    // if user selected up and snake's head in first row of board
    (currentSnake[0] - boardWidth <= 0 && direction === -boardWidth) ||
    // if the result of the user's move is a square already owned by the snake
    squares[currentSnake[0] + direction].classList.contains("snake")
     ) {
      return true;
    } else {
      return false;
    }
}

function moveSnake(squares) {
  // remove last square of snake
  let tail = currentSnake.pop();
  squares[tail].classList.remove('snake');
  // add new square in selected direction
  currentSnake.unshift(currentSnake[0] + direction);
  squares[currentSnake[0]].classList.add('snake');
  
  eatApple(squares, tail);
}

function eatApple(squares, tail) {
  if (squares[currentSnake[0]].classList.contains('apple')) {
    squares[currentSnake[0]].classList.remove('apple'); // remove apple stylings from apple
    squares[currentSnake[0]].classList.add('snake'); // add apple square to head of snake
    currentSnake.push(tail); // add tail back to the snake (so it grows by 1)
    randomApple(squares); // select a new apple
  
    updateScore();
    

    if (intervalTime >= 300) {
      clearInterval(interval); // clear interval or you end up with 2...
      intervalTime *= speed; // increase speed up until 300 then keep it constant
      interval = setInterval(moveOutcome, intervalTime); // set interval again with updated intervalTime
    }
     
  }
}

function updateScore() {
  score++;
  scoreDisplay.innerHTML = `score: ${score}`;
}

function resetGameVariables() {
  score = 0;
  scoreDisplay.innerHTML = `score: ${score}`;
  currentIndex = 0;
  intervalTime = 600;
}

// moving the snake with buttons / keyboard
directionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.contains('up') && handleDirection(-boardWidth);
    btn.classList.contains('down') && handleDirection(+boardWidth);
    btn.classList.contains('left') && handleDirection(-1);
    btn.classList.contains('right') && handleDirection(+1); 
  })
})

function handleDirection(value) {
  direction = value;
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keyup', handleKeyCommands);
  createGrid();
})

function handleKeyCommands(event) { 
  if (event.key === 'ArrowLeft') {
    handleDirection(-1);
  } else if (event.key === 'ArrowUp') {
      handleDirection(-boardWidth);
  } else if (event.key === 'ArrowRight') {
      handleDirection(1);
  } else if (event.key === 'ArrowDown') {
      handleDirection(boardWidth);
  }
}

// game over

function gameOver() {
  toggleVisibility(popup);
  toggleVisibility(document.querySelector('.backdrop'));
  displayScore();
  gameOverAudio.play();
}

replayBtn.addEventListener('click', replay);

function replay() {
  gameBoard.innerHTML = ''; 
  createGrid();
  startGame();
  toggleVisibility(popup);
  toggleVisibility(document.querySelector('.backdrop'));
}

function displayScore() {
  document.getElementById('final-result').textContent = score;
}

// audio settings
function toggleAudio(audio) {
  if (audio.paused) {
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

function toggleClass(element, className) {
    element.classList.toggle(className);
}

