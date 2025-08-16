// DOM variables
const modeBtns = document.querySelectorAll('.btns.mode button');
const btnsContainer = document.querySelector('.btns.mode');
const playAgainBtn = document.querySelector('.play-again-button');
const boardContainer = document.querySelector('.board');
const result = document.getElementById('result');
const gameOverDisplay = document.querySelector('.game-over-display');
const infoBtn = document.getElementById('info-btn');
const moreInfoModal = document.querySelector('.computer-move-info');
const closeModalBtn = document.getElementById('close-modal');

// game variables
const playerX_color = '#ed9f57';
const playerO_color = '#4ebdd9';

let tiles;
let againstComputer;
let aiBattle;
let boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currentPlayer;
let playerX = 'X';
let playerO = 'O';


// game

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'two-players') {
            againstComputer = false;
            prepareGameboard();
            playerTurn(boardState, currentPlayer); 
        }

        if (btn.id === 'computer') {
            againstComputer = true;
            prepareGameboard();
            playerTurn(boardState, currentPlayer) 
        }

        if (btn.id === 'ai-battle') {
            aiBattle = true;
            prepareGameboard();
            computerTurn(boardState, currentPlayer);
        }
    })
})


function startGame() {
    createBoard();

    tiles = document.querySelectorAll('.tile');
    handleBorders(tiles);

    currentPlayer = playerX; 
    boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // reset board state
}

function prepareGameboard() {
    toggleVisibility(btnsContainer);
    startGame();
}


function playerTurn(board, player) {
    if (!isGameActive() || win(board, playerX) || win(board, playerO)) {
        // hadle game over
        setTimeout(() => gameOver(board, playerX, playerO), 300);
    } else {
        tiles.forEach((tile, index) => {
            tile.onclick = () => {
                    if (tile.innerHTML == '') {
                    tile.innerHTML = player;
                    board[index] = player;
                    handleColor(tile, player);
                if (!againstComputer) {
                    player == playerX ? player = playerO : player = playerX;
                    playerTurn(board, player);    
                } else {
                    // remove pointer events for tiles when computer is making its move
                    document.querySelectorAll('.tile').forEach(tile => tile.classList.add('inactive'));
                    setTimeout(function() {
                        computerTurn(board, playerO);
                    }, 800);
                }    
                } 
            }
        })
    }
}

function computerTurn(board, player) {
    if (!isGameActive() || win(board, playerX) || win(board, playerO)) {
        // hadle game over
        setTimeout(() => gameOver(board, playerX, playerO), 300);
    } else {
          
            let bestMove = minimax(board, player);
            tiles[bestMove.index].innerHTML = player;
            board[bestMove.index] = player;
            handleColor(tiles[bestMove.index], player);
       
            if (aiBattle) { 
                player = player == playerX ? playerO : playerX;
                setTimeout(() => {
                    computerTurn(board, player)
                }, 800);
            } else {
                document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('inactive'));
                playerTurn(board, playerX);    
            }

    }
    
}  

function isGameActive() {
   if (Array.from(tiles).some(tile => tile.innerHTML == '')) {
    return true;
   } else {
    return false;
   }
}


function win(board, player) {
    if (
        board[0] == player && board[1] == player && board[2] == player ||
        board[3] == player && board[4] == player && board[5] == player ||
        board[6] == player && board[7] == player && board[8] == player ||
        board[0] == player && board[3] == player && board[6] == player ||
        board[1] == player && board[4] == player && board[7] == player ||
        board[2] == player && board[5] == player && board[8] == player ||
        board[0] == player && board[4] == player && board[8] == player ||
        board[2] == player && board[4] == player && board[6] == player
    ) {
        return true;
    } else {
        return false;
    }
}

function gameOver(board, player1, player2) {
    if (win(board, player1)) {
        result.innerHTML = 'Player <span>X</span> won!'
    } else if (win(board, player2)) {
        result.innerHTML = 'Player <span>O</span> won!'
    } else {
        result.innerHTML = 'It\'s a tie!'
    }

    toggleVisibility(gameOverDisplay);
    toggleVisibility(document.querySelector('.backdrop'));
}

function createBoard() {
    for (let i = 0; i < 9; i++) { 
        const tile = document.createElement('div');
        tile.classList.add('tile');
        boardContainer.appendChild(tile);
    }
}

function deleteBoard() {
    boardContainer.innerHTML = ''
}

// reset
playAgainBtn.addEventListener('click', () => {
    deleteBoard();
    resetBooleans();

    toggleVisibility(btnsContainer);
    toggleVisibility(gameOverDisplay);
    toggleVisibility(document.querySelector('.backdrop'));

});

function resetBooleans() {
    againstComputer = undefined;
    aiBattle = undefined;
}


// minimax algorithm heavens pray for me 
function emptyIndexes(board) {
    return board.filter(spot => spot != 'O' && spot != 'X')
}

function minimax(board, player) {
    let availableSpots = emptyIndexes(board);

    if (win(board, playerX)) {
        return {score: -10}; // if opponent wins, score is negative
    } else if (win(board, playerO)) {
        return {score: 10}; // if player wins, score is positie
    } else if (availableSpots.length === 0) {
        return {score: 0}; // if it's a draw, score is 0
    }

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        board[availableSpots[i]] = player;

        let result;
        if (player === playerO) {
            result = minimax(board, playerX);
        } else {
            result = minimax(board, playerO);
        }

        move.score = result.score;
        board[availableSpots[i]] = move.index;
        moves.push(move);
    }

    // Randomness: 1% chance to pick any move
    if (Math.random() < 0.01) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    // Otherwise, pick best move
    let bestMoves = [];
    let bestScore = player === playerO ? -Infinity : Infinity;

    for (let i = 0; i < moves.length; i++) {
        if (
            (player === playerO && moves[i].score > bestScore) ||
            (player === playerX && moves[i].score < bestScore)
        ) {
            bestScore = moves[i].score;
            bestMoves = [moves[i]];
        } else if (moves[i].score === bestScore) {
            bestMoves.push(moves[i]);
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

// style
function handleColor(tile, player) {
    if (player == playerO) {
        tile.style.color = playerO_color
    } else {
        tile.style.color = playerX_color
    }
}

function toggleVisibility(element) {
    element.classList.toggle('hide');
}


function handleBorders(tiles) {
    tiles.forEach((tile, index) => {

            if (index === 0 || index % 3 === 0) {
                tile.classList.add('no-border-left'); 
            }
            if (index === 6 || index === 7 || index === 8) {
                tile.classList.add('no-border-bottom'); 
            }
        })
}

// more info modal
infoBtn.addEventListener('click', () => toggleVisibility(moreInfoModal));
moreInfoModal.addEventListener('click', () => toggleVisibility(moreInfoModal));