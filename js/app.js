const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const values = '2,3,4,5,6,7,8,9,10,jack,queen,king,ace';
const toConvert = ["jack", "queen", "king"]
const playersHTML = document.querySelector(".js-players-hand")
const dealersHTML = document.querySelector(".js-dealers-hand")
const tablePlayer = document.querySelector(".js-players-table")
const tableDealer = document.querySelector(".js-dealers-table")
const giveCardBtn = document.querySelector(".js-give-card")
const stopBtn = document.querySelector(".js-stop")
const newGameBtn = document.querySelector(".js-newgame")
const resultsHTML = document.querySelector(".js-results")
let deck = [];
let playersHand = []
let dealersHand = []

function init() {
    playersHTML.innerHTML = ``
    dealersHTML.innerHTML = ``
    tablePlayer.innerHTML = ``
    tableDealer.innerHTML = ``
    playersHand = []
    dealersHand = []
    stopBtn.disabled = false;
    giveCardBtn.disabled = false;
    resultsHTML.innerHTML = ``
    createDeck()
    startingCards()
    startingCards()
    if (playerSum() === 21) {
        checkingDealer()
        finalResult()
    }
}

function createDeck() {
    deck = []
    for (let value of values.split(',')) { for (let suit of suits) { deck.push({ value, suit }) } }
    //Fisher-Yates algorithm
    let l = deck.length;
    while (--l > 0) {
        let randIndex = Math.floor(Math.random() * (l + 1));
        [deck[randIndex], deck[l]] = [deck[l], deck[randIndex]];
    }
    return deck
}

function startingCards() {
    playerSum()
    if (playerSum() < 21) {
        const randomIndex = (Math.floor(Math.random() * deck.length))
        let newCards = deck.splice(randomIndex, 1)
        let newCard = newCards[0]
        playersHand.push(newCard)
        playersHTML.innerHTML += `<p class="cardName">${newCard.suit} ${newCard.value}</p>`
        tablePlayer.innerHTML += `<img class="card-img" src="./imgs/English_pattern_${newCard.value}_of_${newCard.suit}.svg" alt="">`
        valueOfAceP()
        document.querySelector(".js-valuesp").innerText = `Össz érték: ${playerSum()}`
        if (playerSum() >= 21) { finalResult() }
        if (playersHand.length <= 2 && playerSum() != 21) { checkingDealer() }
    }
    if (dealersSum() === 21) {
        finalResult()
    }
}

function valueOfAceP() {
    for (let i = 0; i < playersHand.length; i += 1) {
        if (playersHand[i].value === 1) {
            break
        }
        else if ((playersHand[i].value).includes("ace") && playerSum() > 21) {
            playersHand[i].value = 1
        }
    }
}

function valueOfAceD() {
    for (let i = 0; i < dealersHand.length; i += 1) {
        if (dealersHand[i].value === 1) {
            break
        }
        else if ((dealersHand[i].value).includes("ace") && dealersSum() > 21) {
            dealersHand[i].value = 1
        }
    }
}

function playerSum() {
    let sumPlayer = 0
    for (let i = 0; i < playersHand.length; i += 1) {
        if (toConvert.includes(playersHand[i].value)) { sumPlayer += 10 }
        else if (playersHand[i].value === "ace") { sumPlayer += 11 }
        else { sumPlayer += parseInt(playersHand[i].value) }
    }
    return sumPlayer;
}

function checkingDealer() {
    document.querySelector(".js-valuesd").innerText = ``
    if (dealersSum() < 17 && playerSum() <= 21) { drawCardByDealer() }
    if (dealersHand.length <= 1) {
        dealersHTML.innerHTML += `<p class="cardName">${dealersHand[0].suit} ${dealersHand[0].value}</p>`
        tableDealer.innerHTML += `<img class="card-img" src="./imgs/English_pattern_${dealersHand[0].value}_of_${dealersHand[0].suit}.svg" alt="">`
    }
    valueOfAceD()
}

function drawCardByDealer() {
    const randomIndex = (Math.floor(Math.random() * deck.length))
    let newCards = deck.splice(randomIndex, 1)
    let newCard = newCards[0]
    dealersHand.push(newCard)
}

function dealersSum() {
    let sumD = 0
    for (let i = 0; i < dealersHand.length; i += 1) {
        if (toConvert.includes(dealersHand[i].value)) { sumD += 10 }
        else if (dealersHand[i].value === "ace") { sumD += 11 }
        else { sumD += parseInt(dealersHand[i].value) }
    }
    return sumD;
}

function showDealersCards() {
    dealersHTML.innerHTML = ``;
    document.querySelector(".js-valuesd").innerText = `Össz érték: ${dealersSum()}`
    tableDealer.innerHTML = ``
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
    stopBtn.disabled = true;
    giveCardBtn.disabled = true;
    dealersSum()
}

function finalResult() {
    while (dealersSum() < 17 && playerSum() < 21) { checkingDealer() }
    showDealersCards()
    if (playersHand.length === 2 && playerSum() === 21 && dealersSum() === playerSum()) {
        resultsHTML.innerHTML = `<p>Döntetlen! Két blackjack!</p>`
    }
    else if (playersHand.length === 2 && playerSum() === 21) {
        resultsHTML.innerHTML = `<p>Blackjack! Nyertél!</p>`
    }
    else if (dealersHand.length === 2 && dealersSum() === 21) {
        resultsHTML.innerHTML = `<p>Az osztónak Blackjack! Vesztettél.</p>`
    }
    else if (dealersSum() <= 21 && dealersSum() > playerSum()) {
        resultsHTML.innerHTML = `<p>A dealer nyert! Lapjainak értéke összesen: ${dealersSum()}</p>`
    }
    else if (playerSum() <= 21 && playerSum() > dealersSum()) {
        resultsHTML.innerHTML = `<p>A játékos nyert! Lapjainak értéke összesen: ${playerSum()}</p>
        <p>A dealer lapjainak össz értéke: ${dealersSum()} </p>`
    }
    else if (playerSum() <= 21 && playerSum() == dealersSum()) {
        resultsHTML.innerHTML = `<p>Döntetlen! Lapok értéke: ${playerSum()}</p>`
    }
    else if (dealersSum() > 21 && playerSum() <= 21) {
        resultsHTML.innerHTML = `<p>A dealer lapjainak értéke (${dealersSum()}) több, mint 21!</p> 
        <p>A játékos nyert! A játékos lapjainak össz értéke: ${playerSum()}</p>`
    }
    else if (playerSum() > 21 && dealersSum() <= 21) {
        resultsHTML.innerHTML = `<p>A játékos lapjainak értéke (${playerSum()}) több, mint 21!</p> 
        <p>A dealer nyert! A dealer lapjainak össz értéke: ${dealersSum()}</p>`
    }

}

addEventListener("load", init)
giveCardBtn.addEventListener("click", startingCards)
stopBtn.addEventListener("click", finalResult)
newGameBtn.addEventListener("click", init)