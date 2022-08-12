const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const values = '2,3,4,5,6,7,8,9,10,jack,queen,king,ace';
const toConvert = ["jack", "queen", "king"];
const playersHTML = document.querySelector(".js-players-hand");
const dealersHTML = document.querySelector(".js-dealers-hand");
const tablePlayer = document.querySelector(".js-players-table");
const tableDealer = document.querySelector(".js-dealers-table");
const giveCardBtn = document.querySelector(".js-give-card");
const stopBtn = document.querySelector(".js-stop");
const newGameBtn = document.querySelector(".js-newgame");
const resultsHTML = document.querySelector(".js-results");
const dealersSumHTML = document.querySelector(".js-valuesd");
let deck = [];
let playersHand = [];
let dealersHand = [];

function createDeck() {
    deck = [];
    for (let value of values.split(',')) { for (let suit of suits) { deck.push({ value, suit }) } };
    let le = deck.length;
    while (--le > 0) {
        let randomIndex = Math.floor(Math.random() * (le + 1));
        [deck[randomIndex], deck[le]] = [deck[le], deck[randomIndex]];
    };
    return deck;
}

// Az "új játék" funkció és betöltéskor alapértelmezett állapot
function init() {
    stopBtn.disabled = false;
    giveCardBtn.disabled = false;
    resultsHTML.innerHTML = ``;
    dealersSumHTML.innerText = ``;
    tablePlayer.innerHTML = ``;
    playersHTML.innerHTML = ``;
    playersHand = [];
    dealersHand = [];
    createDeck();
    startGame();
}

// Csak az init-ben fut le! Az init része.
function startGame() {
    drawByPlayer();
    drawByDealer();
    drawByPlayer();
    drawByDealer();
}

function valueCheck() { if (playerSum() === 21 || dealerSum() === 21 || playerSum() >= 21) { endGame() } }

function drawByPlayer() {
    let randomIndex = (Math.floor(Math.random() * deck.length));
    let newCard = deck.splice(randomIndex, 1)[0];
    playersHand.push(newCard);
    playersHTML.innerHTML += `<p class="cardName">${newCard.suit} ${newCard.value}</p>`;
    tablePlayer.innerHTML += `<img class="card-img" src="./imgs/English_pattern_${newCard.value}_of_${newCard.suit}.svg" alt="">`;
    valueOfAce(playersHand, playerSum);
    document.querySelector(".js-valuesp").innerText = `Össz érték: ${playerSum()}`;
    valueCheck();
}

function drawByDealer() {
    let randomIndex = (Math.floor(Math.random() * deck.length));
    let newCard = deck.splice(randomIndex, 1)[0];
    dealersHand.push(newCard);
    if (dealersHand.length <= 1) {
        dealersHTML.innerHTML = `<p class="cardName">${dealersHand[0].suit} ${dealersHand[0].value}</p>`;
        tableDealer.innerHTML = `<img class="card-img" src="./imgs/English_pattern_${dealersHand[0].value}_of_${dealersHand[0].suit}.svg" alt="">
        <img class="card-img" src="./imgs/Card_back_01.svg" alt="">`;
    }
    valueOfAce(dealersHand, dealerSum);
    valueCheck();
}

function playerSum() {
    let sumPlayer = 0;
    for (let i = 0; i < playersHand.length; i += 1) {
        if (toConvert.includes(playersHand[i].value)) { sumPlayer += 10 }
        else if (playersHand[i].value === "ace") { sumPlayer += 11 }
        else { sumPlayer += parseInt(playersHand[i].value) }
    }
    return sumPlayer;
}

function dealerSum() {
    let sumDealer = 0;
    for (let i = 0; i < dealersHand.length; i += 1) {
        if (toConvert.includes(dealersHand[i].value)) { sumDealer += 10 }
        else if (dealersHand[i].value === "ace") { sumDealer += 11 }
        else { sumDealer += parseInt(dealersHand[i].value) }
    }
    return sumDealer;
}

function valueOfAce(whoseHand, whoseSum) {
    for (let i = 0; i < whoseHand.length; i += 1) {
        if (whoseHand[i].value === 1) { continue; }
        else if ((whoseHand[i].value).includes("ace") && whoseSum() > 21) {
            whoseHand[i].value = 1
        }
    }
}

function showDealersCards() {
    dealersHTML.innerHTML = ``;
    tableDealer.innerHTML = ``;
    dealersSumHTML.innerText = `Össz érték: ${dealerSum()}`;
    for (let i = 0; i < dealersHand.length; i += 1) {
        if (dealersHand[i].value === 1) {
            dealersHTML.innerHTML += `<p class="cardName">${dealersHand[i].suit} ace</p>`
            tableDealer.innerHTML += `<img class="card-img" src="./imgs/English_pattern_ace_of_${dealersHand[i].suit}.svg" alt="">`
        }
        else {
            dealersHTML.innerHTML += `<p class="cardName">${dealersHand[i].suit} ${dealersHand[i].value}</p>`
            tableDealer.innerHTML += `<img class="card-img" src="./imgs/English_pattern_${dealersHand[i].value}_of_${dealersHand[i].suit}.svg" alt="">`
        }
    }
}

function dealersTurn() { while (dealerSum() < 17 && playerSum() < 21) { drawByDealer() } }

function endGame() {
    stopBtn.disabled = true;
    giveCardBtn.disabled = true;
    dealersTurn();
    showDealersCards();
    if (playersHand.length === 2 && playerSum() === 21 && dealerSum() === playerSum()) {
        resultsHTML.innerHTML = `<p>Döntetlen! Két blackjack!</p>`
    }
    else if (playersHand.length === 2 && playerSum() === 21) {
        resultsHTML.innerHTML = `<p>Blackjack! Nyertél!</p>`
    }
    else if (dealersHand.length === 2 && dealerSum() === 21) {
        resultsHTML.innerHTML = `<p>Az osztónak Blackjack! Vesztettél.</p>`
    }
    else if (dealerSum() <= 21 && dealerSum() > playerSum()) {
        resultsHTML.innerHTML = `<p>A dealer nyert! Lapjainak értéke összesen: ${dealerSum()}</p>`
    }
    else if (playerSum() <= 21 && playerSum() > dealerSum()) {
        resultsHTML.innerHTML = `<p>A játékos nyert! Lapjainak értéke összesen: ${playerSum()}</p>
        <p>A dealer lapjainak össz értéke: ${dealerSum()} </p>`
    }
    else if (playerSum() <= 21 && playerSum() == dealerSum()) {
        resultsHTML.innerHTML = `<p>Döntetlen! Lapok értéke: ${playerSum()}</p>`
    }
    else if (dealerSum() > 21 && playerSum() <= 21) {
        resultsHTML.innerHTML = `<p>A dealer lapjainak értéke (${dealerSum()}) több, mint 21!</p> 
        <p>A játékos nyert! A játékos lapjainak össz értéke: ${playerSum()}</p>`
    }
    else if (playerSum() > 21 && dealerSum() <= 21) {
        resultsHTML.innerHTML = `<p>A játékos lapjainak értéke (${playerSum()}) több, mint 21!</p> 
        <p>A dealer nyert! A dealer lapjainak össz értéke: ${dealerSum()}</p>`
    }
}

addEventListener("load", init)
giveCardBtn.addEventListener("click", drawByPlayer)
newGameBtn.addEventListener("click", init)
stopBtn.addEventListener("click", endGame)