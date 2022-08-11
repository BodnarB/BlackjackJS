const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const values = '2,3,4,5,6,7,8,9,10,jack,queen,king,ace';
const toConvert = ["jack", "queen", "king"]
const playersHTML = document.querySelector(".js-players-hand")
const dealersHTML = document.querySelector(".js-dealers-hand")
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
    playersHand = []
    dealersHand = []
    createDeck()
    startingCards()
    startingCards()
    stopBtn.disabled = false;
    giveCardBtn.disabled = false;
    resultsHTML.innerHTML = ``
    if (playerSum() >= 21) {
        finalResult()
        checkingDealer()
        showDealersCards()
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
        valueOfAce()
        document.querySelector(".js-valuesp").innerText = `Össz érték: ${playerSum()}`
        if (playersHand.length <= 2) { checkingDealer() }
        if (playerSum() >= 21) { finalResult() }
    }
    
}

function valueOfAce() {
    for (let i = 0; i < playersHand.length; i += 1) {
        if (playersHand[i].value === 1){
            break
        }
        else if ((playersHand[i].value).includes("ace") && playerSum() > 21) {
            playersHand[i].value = 1
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
    }
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
    for (let i = 0; i < dealersHand.length; i += 1) {
        dealersHTML.innerHTML += `<p class="cardName">${dealersHand[i].suit} ${dealersHand[i].value}</p>`
    }
    stopBtn.disabled = true;
    giveCardBtn.disabled = true;
    dealersSum()
}

function finalResult() {
    while (dealersSum() < 17 && playerSum() < 21) { checkingDealer() }
    dealerTotal = dealersSum()
    playerTotal = playerSum()

    if (playersHand.length === 2 && playerTotal === 21) {
        resultsHTML.innerHTML = `<p>Blackjack! Nyertél!</p>`
    }
    else if (dealerTotal <= 21 && dealerTotal > playerTotal) {
        resultsHTML.innerHTML = `<p>A dealer nyert! Lapjainak értéke összesen: ${dealerTotal}</p>`
    }
    else if (playerTotal <= 21 && playerTotal > dealerTotal) {
        resultsHTML.innerHTML = `<p>A játékos nyert! Lapjainak értéke összesen: ${playerTotal}</p>
        <p>A dealer lapjai összesen: ${dealerTotal} </p>`
    }
    else if (playerTotal <= 21 && playerTotal == dealerTotal) {
        resultsHTML.innerHTML = `<p>Döntetlen! Lapok értéke: ${playerTotal}</p>`
    }
    else if (dealerTotal > 21 && playerTotal <= 21) {
        resultsHTML.innerHTML = `<p>A dealer lapjainak értéke (${dealerTotal}) több, mint 21!</p> 
        <p>A játékos nyert! A játékos lapjainak össz értéke: ${playerTotal}</p>`
    }
    else if (playerTotal > 21 && dealerTotal <= 21) {
        resultsHTML.innerHTML = `<p>A játékos lapjainak értéke (${playerTotal}) több, mint 21!</p> 
        <p>A dealer nyert! A dealer lapjainak össz értéke: ${dealerTotal}</p>`
    }
    showDealersCards()
}

addEventListener("load", init)
giveCardBtn.addEventListener("click", startingCards)
stopBtn.addEventListener("click", finalResult)
newGameBtn.addEventListener("click", init)