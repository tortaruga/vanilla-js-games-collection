// variables
const optionBtns = document.querySelectorAll('.option');
const versionBtn = document.querySelector('.game-version-btn');
const playAgainBtn = document.querySelector('.play-again-btn');

const step1 = document.querySelector('.step-1');
const step1Bonus = document.querySelector('.step-1-bonus');
const step2 = document.querySelector('.step-2');
const step4 = document.querySelector('.step-4');

const userChoiceBorder = document.querySelector('.border-user-2');
const computerChoiceBorder = document.querySelector('.empty-slot');
 
const verdictContainer = document.querySelector('.verdict');
const scoreContainer = document.querySelector('.score');

const rulesImg = document.querySelector('.rules-diagram');

let isBonusVersion = false;
let userChoice;
let computerChoice;
let score = 0;

const rulesDiagrams = {
    regularVersion: './images/image-rules.svg',
    bonusVersion: './images/image-rules-bonus.svg',
}

// handle game version toggle switch
versionBtn.addEventListener('click', () => {
    isBonusVersion = isBonusVersion ? false : true;

    if (isBonusVersion) {
        hideElement(step1);
        showElement(step1Bonus);
        versionBtn.textContent = 'Play regular version'
    } else {
        hideElement(step1Bonus);
        showElement(step1);
        versionBtn.textContent = 'Play weird version';
    } 

    handleRulesDiagram();
})

function handleRulesDiagram() {
    rulesImg.setAttribute('src', `${isBonusVersion ? rulesDiagrams.bonusVersion : rulesDiagrams.regularVersion}`);
}

// step 1: user chooses option
const choiceMap = {
    'paper-btn': 'paper',
    'rock-btn': 'rock', 
    'scissors-btn': 'scissors', 
    'lizard-btn': 'lizard', 
    'spock-btn': 'spock'
};

optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // set userChoice based on button clicked
        for (const [key, value] of Object.entries(choiceMap)) {
            if (btn.classList.contains(key)) {
                userChoice = value;
                break;
            }
        }

        // hide game version button until end of game
        hideElement(versionBtn);
        // trigger step 2
        displayUserChoice();
    })
})

// step 2: user choice vs empty computer choice slot
function displayUserChoice() {
    // hide step 1 (or step 1 bonus)
    if (isBonusVersion) {
        hideElement(step1Bonus);
    } else {
        hideElement(step1);
    }
    // show step 2
    showElement(step2);
    // create user choice icon
    createChoiceIcon(userChoice, userChoiceBorder);  
    // trigger step 3
    setTimeout(displayComputerChoice, 1000);
}

// step 3: display computer choice
function displayComputerChoice() {
    // select random choice for computer
    const choices = !isBonusVersion ? 
        ['paper',
        'rock',
        'scissors'] :
        ['paper',
        'rock',
        'scissors',
        'lizard',
        'spock'
    ];

    const randomChoiceIndex = Math.floor(Math.random() * choices.length);
    computerChoice = choices[randomChoiceIndex];

    // create computer choice icon
    createChoiceIcon(computerChoice, computerChoiceBorder);
    // trigger step 4
    setTimeout(displayWinner, 1000);
}

function createChoiceIcon(playerChoice, playerBorder) {
    const choiceIcon = document.createElement('div');
    choiceIcon.classList.add(`${playerChoice}-btn`);
    choiceIcon.setAttribute('aria-label', 'you picked' + playerChoice);
    playerBorder.appendChild(choiceIcon);
    playerBorder.classList.add(`border-${playerChoice}`, 'btn-border'); 
}

// step 4: display winner 
function displayWinner() {
    // show verdict
    showElement(step4); 

    getWinner(userChoice, computerChoice);

    // add winner animation and handle score
    if (getWinner(userChoice, computerChoice) === true) {
        userChoiceBorder.classList.add('winner');
        score++;
    } else if (getWinner(userChoice, computerChoice) === false) {
        computerChoiceBorder.classList.add('winner');
        score--; 
    }

    scoreContainer.textContent = score;
    localStorage.setItem('score', score);
}

function getWinner(player1, player2) {
    let verdict;
    let userWins; 

    const rules = {
        rock: ['scissors', 'lizard'],
        paper: ['rock', 'spock'],
        scissors: ['paper', 'lizard'],
        lizard: ['spock', 'paper'],
        spock: ['scissors', 'rock'],
    };

    if (player1 === player2) {
        verdict = 'it\'s a tie';
    } else {
        if (rules[player1].includes(player2)) {
            verdict = 'you win';
            userWins = true;
        } else {
            verdict = 'you lose';
            userWins = false;
        }
    }
    
    verdictContainer.textContent = verdict;
    return userWins;
}

playAgainBtn.addEventListener('click', () => {
    resetGameDisplay();

    resetChoices(userChoiceBorder, userChoice);
    resetChoices(computerChoiceBorder, computerChoice, 'btn-border'); 

    removeWinnerStyling(userChoiceBorder);
    removeWinnerStyling(computerChoiceBorder);
})

function resetGameDisplay() {
    // hide step 2 and verdict
    hideElement(step2);
    hideElement(step4);
    // show step 1
    isBonusVersion ? showElement(step1Bonus) : showElement(step1);
    // show version toggle
    showElement(versionBtn);
}

function resetChoices(playerBorder, playerChoice, additionalClass = null) {
    playerBorder.innerHTML = '';
    playerBorder.classList.remove(`border-${playerChoice}`);

    // ensure the styling of empty slot is reset for the computer choice
    if (additionalClass) {
        playerBorder.classList.remove(additionalClass);
    }
}

function removeWinnerStyling(playerBorder) {
    playerBorder.classList.remove('winner');
}

// display saved score on refresh
window.addEventListener('load', () => {
    let savedScore = localStorage.getItem('score');

    scoreContainer.textContent = savedScore ? savedScore : 0; 
})

// close modal on pressing ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = bootstrap.Modal.getInstance(document.getElementById('rules-modal'));
      modal.hide();
    }
});
  
// utility functions
function showElement(element) {
    element.classList.remove('hide');
}

function hideElement(element) {
    element.classList.add('hide');
}
