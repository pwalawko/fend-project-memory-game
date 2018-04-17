const cardList = [
    'fa-anchor',
    'fa-bomb',
    'fa-bicycle',
    'fa-bolt',
    'fa-cube',
    'fa-diamond',
    'fa-leaf',
    'fa-paper-plane-o'
];
const doubledCardList = cardList.concat(cardList);

function prepareDeck() {
    // This function defines what should happen
    // to prepare the deck. It is:
    // - shuffle cards
    // - create card element for every symbol
    // - add the cards to the DOM
    // - create listener for clicking a card
    // - create listerer for starting the timer
    const shuffledCardList = shuffle(doubledCardList);

    const deckList = document.createElement('ul');
    deckList.className = 'deck';

    for (const card of shuffledCardList) {
        const liElement = document.createElement('li');
        liElement.className = 'card';
        const iElement = document.createElement('i');
        iElement.className = 'fa ' + card;
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
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const game = {
    moves: 0,
    matches: [],
    modal: document.querySelector('#endModal')
};

function gameEnd() {
    // This function defines what should happen
    // at the end of the game. It is:
    // - stop the timer
    // - display the modal with users achievements
    clearTimeout(t);
    game.modal.style.display = 'block';
    const finalTime = document.querySelector('#final-time');
    const finalMoves = document.querySelector('#final-moves');
    const finalStars = document.querySelector('#final-stars');
    const starsNumber = document.querySelectorAll('.fa-star').length;
    finalTime.textContent = 'Your time is $(timer.displayer.textContent),';
    finalMoves.textContent = 'You did it in $(displayMoves.textContent),';
    finalStars.textContent = 'and that gives you $(starsNumber) stars!';
}

function checkIfCardMatches(opCards) {
    // This function checks if the two opened card matches.
    // If they does not match, the function closes the card
    // by removing 'open' class.
    // If they matches, the function adds appropriate style
    // by addin 'match' class.
    // If all cards are matched, the game ends.
    const firstCard = opCards[0].firstElementChild.className;
    const secondCard = opCards[1].firstElementChild.className;
    if (firstCard !== secondCard) {
        for (const card of opCards) {
            card.classList.remove('open');
        }
    } else {
        for (const card of opCards) {
            card.classList.add('match');
        }
    }
    game.matches = [];

    const matchedCards = document.querySelectorAll('.card.match');
    if (matchedCards.length === 16) {
        gameEnd();
    }
}

function makeStarEmpty(starIcon) {
    starIcon.className = 'fa fa-star-o';
}

const stars = document.querySelectorAll('ul.stars li i');

function starsCounter() {
    switch (game.moves) {
        case 18:
            makeStarEmpty(stars[2]);
            break;
        case 27:
            makeStarEmpty(stars[1]);
    }
}

const displayMoves = document.querySelector('.moves');

function respondToClickCard(evt) {
    // This function defines what should happen when a card is clicked.
    // - check if the card matches
    // - increase the moves number
    // - count stars
    // - set the timer (only for the first card clicked)
    if (
        evt.target.nodeName === 'LI' &&
        !evt.target.classList.contains('open') &&
        game.matches.length < 2
    ) {
        evt.target.classList.add('open');
        if (game.matches[0] !== evt.target) {
            game.matches.push(evt.target);
        }
        if (game.matches.length === 2) {
            game.moves++;
            displayMoves.textContent = game.moves + ' Move';
            if (game.moves !== 1) {
                displayMoves.textContent += 's';
            }
            starsCounter();
            setTimeout(checkIfCardMatches, 500, game.matches);
        }
    }
}

// Timer from https://jsfiddle.net/Daniel_Hug/pvk6p/
const timer = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    displayer: document.querySelector('.timer')
};

function add() {
    timer.seconds++;
    if (timer.seconds >= 60) {
        timer.seconds = 0;
        timer.minutes++;
        if (timer.minutes >= 60) {
            timer.minutes = 0;
            timer.hours++;
        }
    }

    timer.displayer.textContent =
        (timer.hours
            ? timer.hours > 9
                ? timer.hours
                : '0' + timer.hours
            : '00') +
        ':' +
        (timer.minutes
            ? timer.minutes > 9
                ? timer.minutes
                : '0' + timer.minutes
            : '00') +
        ':' +
        (timer.seconds > 9 ? timer.seconds : '0' + timer.seconds);

    addTimer();
}
function addTimer() {
    t = setTimeout(add, 1000);
}

function startTimer(evt) {
    if (evt.target.nodeName === 'LI') {
        evt.target.parentElement.removeEventListener(
            evt.type,
            arguments.callee
        );
        addTimer();
    }
}

function resetTimer() {
    clearTimeout(t);
    timer.displayer.textContent = '00:00:00';
    timer.seconds = 0;
    timer.minutes = 0;
    timer.hours = 0;
}

function restartGame() {
    // This function defines what should happen
    // when the restart button is clicked. It is:
    // - reset open cards, stars and moves counter
    // - reset timer
    // . prepare new deck
    game.matches = [];
    game.moves = 0;
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
    game.modal.style.display = 'none';
    restartGame();
}

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', restartGame);

const playAgainButton = document.querySelector('#play-again-btn');
playAgainButton.addEventListener('click', playAgain);
