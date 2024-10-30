const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-box"),
    },
    cardSprites: {
        myCard: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-card-field"),
        computer: document.getElementById("computer-card-field")
    },
    actions: {
        button: document.getElementById("next-duel")
    },
    cardsLeft: {
        player: 5,
        computer: 5
    }

}
const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }

]

const playerSides = {
    player1: "player-card",
    player1Box: document.querySelector("#player-card"),
    computer: "computer-card",
    computerBox: document.querySelector("#computer-card")
}
async function updateCardCounter() {
    state.cardsLeft.player--;
    state.cardsLeft.computer--;

    if (state.cardsLeft.player > 0 && state.cardsLeft.computer > 0) {
        drawbutton(`Next Duel`);
    } else {
        drawbutton("Try again");
    }
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add("card")
    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard)
        })
    }
    return cardImage
}

state.actions.button.addEventListener("click", () => {
    const bgm = document.getElementById("bgm")
    bgm.play()
    if (state.cardsLeft.player <= 0 && state.cardsLeft.computer <= 0) {
        resetGame();
    }
});

async function removeCardsImages() {
    let { player1Box, computerBox } = playerSides
    let imgElements = player1Box.querySelector("img")
    imgElements.remove()

    imgElements = computerBox.querySelector("img")
    imgElements.remove()

}

async function checkDuelResults(playercardId, computerCardId) {
    let duelResults = "Empate"
    let playerCard = cardData[playercardId]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Vitória"
        state.score.playerScore++
        audioPlay("win")
    }
    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Derrota"
        state.score.computerScore++
        audioPlay("lose")
    }
    return duelResults

}
async function drawbutton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} *** Lose: ${state.score.computerScore}`
}

async function resetGame() {
    state.score.playerScore = 0
    state.score.computerScore = 0
    state.cardsLeft.player = 5
    state.cardsLeft.computer = 5

    updateScore()
    resetDuel()
    init()
}


async function setCardsField(cardId) {
    await removeCardsImages()
    let computerCardId = await getRandomCardId()
    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawbutton(duelResults)
    await updateCardCounter()
}

async function drawSelectCard(index) {
    state.cardSprites.myCard.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type

}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function resetDuel() {
    state.cardSprites.myCard.src = ""
    state.fieldCards.player.src = ""
    state.fieldCards.computer.src = ""
}

async function audioPlay(status) {

    const audioResults = new Audio(`./src/assets/audios/${status}.wav`)
    audioResults.play()
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function init() {
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)
    drawbutton("Start");
}
init()
