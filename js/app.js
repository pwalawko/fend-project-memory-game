/*
 * Create a list that holds all of your cards
 */

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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

    const cardBox = document.querySelector('.card');
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openCards = [];
let numberOfMoves = 0;

function checkIfCardMatches(opCards) {
    if (opCards[0].firstElementChild.className !== opCards[1].firstElementChild.className) {
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
        clearTimeout(t);
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

let displayMoves = document.querySelector('.moves');

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
    evt.target.removeEventListener(evt.type, arguments.callee);
    timer();
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

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', restartGame);
