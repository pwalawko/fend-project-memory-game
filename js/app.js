const cardList = [
    "fa-anchor",
    "fa-anchor",
    "fa-bomb",
    "fa-bomb",
    "fa-bicycle",
    "fa-bicycle",
    "fa-bolt",
    "fa-bolt",
    "fa-cube",
    "fa-cube",
    "fa-diamond",
    "fa-diamond",
    "fa-leaf",
    "fa-leaf",
    "fa-paper-plane-o",
    "fa-paper-plane-o"
];

function prepareDeck() {
    const shuffledCardList = shuffle(cardList);

    const deckList = document.createElement('ul');
    deckList.className = "deck";

    for (const card of shuffledCardList) {
      const liElement = document.createElement('li');
      liElement.className = "card";
      const iElement = document.createElement('i');
      iElement.className = "fa " + card;
      liElement.appendChild(iElement);
      deckList.appendChild(liElement);
    }

    document.querySelector('.container').appendChild(deckList);
    deckList.addEventListener('click', respondToClickCard);

    const cardBox = document.querySelector('.deck');
    cardBox.addEventListener('click', startTimer);
}

prepareDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let openCards = [];
let numberOfMoves = 0;
const modal = document.querySelector('#endModal');

function gameEnd() {
    clearTimeout(t);
    modal.style.display = "block";
    const finalTime = document.querySelector('#final-time');
    const finalMoves = document.querySelector('#final-moves');
    const finalStars = document.querySelector('#final-stars');
    const starsNumber = document.querySelectorAll('.fa-star').length;
    finalTime.textContent = "Your time is " + timerDisplayer.textContent + ",";
    finalMoves.textContent = "You did it in " + displayMoves.textContent + ",";
    finalStars.textContent = "and that gives you " + starsNumber + " stars!";
}

function checkIfCardMatches(opCards) {
    const firstCard = opCards[0].firstElementChild.className;
    const secondCard = opCards[1].firstElementChild.className;
    if (firstCard !== secondCard) {
        for (const card of opCards) {
            card.classList.remove('open');
        }
    } else {
        for (const card of opCards) {
            card.classList.add("match");
        }
    }
    openCards = [];

    const matchedCards = document.querySelectorAll('.card.match');
    if (matchedCards.length === 16) {
        gameEnd();
    }
}

function makeStarEmpty(starIcon){
    starIcon.className = 'fa fa-star-o';
}

const stars = document.querySelectorAll('ul.stars li i');

function starsCounter() {
    switch (numberOfMoves) {
        case 11:
            makeStarEmpty(stars[2]);
            break;
        case 21:
            makeStarEmpty(stars[1]);
            break;
        case 31:
            makeStarEmpty(stars[0]);
    }
}

const displayMoves = document.querySelector('.moves');

function respondToClickCard(evt) {
    if (evt.target.nodeName === "LI" && !evt.target.classList.contains('open') && openCards.length < 2) {
        evt.target.classList.add("open");
        if (openCards[0] !== evt.target) {
            openCards.push(evt.target);
        }
        if (openCards.length === 2) {
            numberOfMoves++;
            displayMoves.textContent = numberOfMoves + ' Move';
            if (numberOfMoves !== 1) {
                displayMoves.textContent += 's';
            }
            starsCounter();
            setTimeout(checkIfCardMatches, 500, openCards);
        }
    }
}

// Timer from https://jsfiddle.net/Daniel_Hug/pvk6p/

let seconds = 0, minutes = 0, hours = 0;
let t;
const timerDisplayer = document.querySelector('.timer');

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    timerDisplayer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}

function startTimer(evt) {
    if (evt.target.nodeName === "LI") {
        evt.target.parentElement.removeEventListener(evt.type, arguments.callee);
        timer();
    }
}

function resetTimer() {
    clearTimeout(t);
    timerDisplayer.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
}

function restartGame() {
    openCards = [];
    numberOfMoves = 0;
    displayMoves.textContent = '0 Moves';
    resetTimer();
    const table = document.querySelector('.deck');
    table.remove();
    prepareDeck();
    for (const star of stars) {
        star.className = 'fa fa-star';
    }
}

function playAgain() {
    modal.style.display = "none";
    restartGame();
}

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', restartGame);

const playAgainButton = document.querySelector('#play-again-btn');
playAgainButton.addEventListener('click', playAgain);
