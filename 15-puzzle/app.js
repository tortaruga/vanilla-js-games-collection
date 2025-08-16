const board = document.getElementById('board');
const tiles = [...Array(15).keys()].map(n => n + 1).concat(null);
let emptyIndex = tiles.indexOf(null);

const shuffleBtn = document.getElementById('shuffle-btn');
const moves = document.getElementById('moves');
const time = document.getElementById('time');
const winModal = document.querySelector('.win-modal');
const modalMoves = document.querySelector('.modal-moves');
const modalTime = document.querySelector('.modal-time');
const resetBtn = document.querySelector('.reset');


let moveCount = 0;
let intervalId;
let seconds = 0;
let minutes = 0;
let hours = 0;


const boardWidth = 4;
const tileWidth = 55;

const colors = ['lavender', 'neon-green', 'sky-blue', 'pink', 'orange', 'yellow'];

// create gameboard
function createBoard() {    
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile'; 
        tileElement.dataset.index = index;
        // choose random bg color
        const randomIndex = Math.floor(Math.random() * colors.length);
        tileElement.style.setProperty('--color', `var(--${colors[randomIndex]})`);

        // position tiles
        tileElement.style.top = (Math.floor(index / boardWidth) * tileWidth) + 'px';
        tileElement.style.left = ((index % boardWidth) * tileWidth) + 'px';
        
        if (tile == null) {
            tileElement.classList.add('empty');
        } else {
            tileElement.textContent = tile; 
            tileElement.addEventListener('click', () => moveTile(tileElement.dataset.index));
        }
        board.appendChild(tileElement);
    })
}

createBoard();

// move tiles

function moveTile(index, checkWinFlag = true) {
    
    let emptyIndex = tiles.indexOf(null);
    const validMoves = [emptyIndex + 1, emptyIndex - 1, emptyIndex + 4, emptyIndex - 4].filter(move => move >= 0 && move < 16 && (
        (move % 4 !== 0 || emptyIndex % 4 !== 3) && 
        (move % 4 !== 3 || emptyIndex % 4 !== 0) 
    ));

    if (validMoves.includes(parseInt(index))) {
        updateMoveCount();
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]]; // switch tiles in the array
       
        const selectedTile = document.querySelector(`.tile[data-index="${index}"]`);
        selectedTile.dataset.index = emptyIndex; // switch the dataset index too
        document.querySelector('.empty').dataset.index = index;
    }
    updateBoard(); // switch tiles in the board


    if (checkWinFlag && checkWin()) {
        handleWinMessage();
    }
}

function updateBoard() {
    // reflect the switch of the tiles array in the DOM tiles 
    tiles.forEach((tileValue, index) => {
        const tile = document.querySelector(`.tile[data-index="${index}"]`);
        
        if (tile) {
          tile.style.top = (Math.floor(index / boardWidth) * tileWidth) + 'px';
          tile.style.left = ((index % boardWidth) * tileWidth) + 'px';
        }
    })
}

// shuffle tiles

function shuffleTiles() {
    for (let i = 0; i < 1000; i++) {
        const randomTile = Math.floor(Math.random() * tiles.length); 
        moveTile(randomTile, false);       
    }
    moveCount = 0;
    moves.innerHTML = 0;
} 

shuffleBtn.addEventListener('click', () => {
    reset();
    shuffleTiles();
    startTimer();
});

function updateMoveCount() {
    moveCount++;
    moves.innerHTML = moveCount;

}

// check win
function checkWin() {

    return Array.from(document.querySelectorAll('.tile:not(.empty')).every(tile => {
        return parseInt(tile.textContent) === parseInt(tile.dataset.index) + 1;
    })

}

function handleWinMessage() {
    stopTimer(); 
    winModal.classList.toggle('hide');
    winModal.classList.toggle('animation');
    modalMoves.innerHTML = moveCount;
    modalTime.innerHTML = `${hours}:${minutes}:${seconds}s`;  
} 

// reset 

function reset() {
    stopTimer();
    moveCount = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    time.innerHTML = `${hours}:${minutes}:${seconds}`;
    moves.innerHTML = 0;
}

const stopTimer = () => {
    clearInterval(intervalId);
}

const startTimer = () => {
    intervalId = setInterval(() => {
        seconds++;
        
        if (seconds >= 60) {
            seconds = 0;
            minutes++;

            if (minutes >= 60) {
                hours++;
                minutes = 0; // Reset minutes when hours increase
            }
        }

        time.innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

resetBtn.addEventListener('click', () => {
    winModal.classList.toggle('hide');
    winModal.classList.toggle('animation');
    reset(); 
})


