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
}

function makeStarEmpty(starIcon){
    starIcon.className = 'fa fa-star-o';
}

function starsCounter() {
    const stars = document.querySelectorAll('ul.stars li i');
    switch (true) {
        case numberOfMoves > 10 && numberOfMoves < 21:
            makeStarEmpty(stars[2]);
            break;
        case numberOfMoves > 20 && numberOfMoves < 31:
            makeStarEmpty(stars[1]);
            break;
        case numberOfMoves > 30:
            makeStarEmpty(stars[0]);
    }
}

function respondToClickCard(evt) {
    if (evt.target.nodeName === "LI" && !evt.target.classList.contains('open') && openCards.length < 2) {
        evt.target.classList.add("open");
        if (openCards[0] !== evt.target) {
            openCards.push(evt.target);
        }
        if (openCards.length === 2) {
            numberOfMoves++;
            let displayMoves = document.querySelector('.moves');
            displayMoves.textContent = numberOfMoves + ' Move';
            if (numberOfMoves > 1) {
                displayMoves.textContent += 's';
            }
            starsCounter();
            setTimeout(checkIfCardMatches, 500, openCards);
        }
    }
}

const deckOfCards = document.querySelector('.deck');

deckOfCards.addEventListener('click', respondToClickCard);
