import { cardData } from "./card-data.js"
const difficulties = document.querySelectorAll(".difficulty li")
const cardCover = document.querySelector(".cards")
const timer = document.querySelector(".timer")
const cardsClick = document.querySelector("div")
const startBtn = document.querySelector(".start")
const homeBtn = document.querySelector(".home-btn")
const restartBtn = document.querySelector(".restart-btn")
const startMenu = document.querySelector(".start-menu")
const scoreScreen = document.querySelector(".score-screen")
const finalScore = document.querySelector(".score-screen h4")

let selected = []
let disableClick = false
let time
let seconds = 0
timer.textContent = "Timer: 0"

let selectedDifficulty = ""

difficulties.forEach(el => {
  el.addEventListener("click", (e) => {
    difficulties.forEach(rm => rm.classList.remove("selected"))
    e.target.classList.add("selected")
    selectedDifficulty = e.target.textContent
  })
})

startBtn.addEventListener("click", startGame)
homeBtn.addEventListener("click", goToHome)
restartBtn.addEventListener("click", restartGame)
cardsClick.addEventListener("click", selectCard)

function startGame() {
  if(!selectedDifficulty) return
  time = setInterval(startTime, 1000)
  generateCards(cardData[selectedDifficulty]).forEach(el => {
    const newDiv = document.createElement("div")
    newDiv.innerHTML = `
      <div class="rounded-md card selected" data-value="${el.id}">
      <div class="cover"></div>
      </div>
    `
    newDiv.style.background = `url(${el.link})`
    newDiv.className = "rounded-md"
    cardCover.appendChild(newDiv)
  })
  startMenu.classList.add("hidden")
  cardCover.classList.remove("hidden")
  timer.classList.remove("hidden")
}


function selectCard(e) {
  if(!e.target.closest(".card")) return
  if(selected.length == 2 || disableClick) return

  selected.push(e.target.attributes["data-value"].value)
  e.target.classList.remove("selected")
  e.target.classList.add("pointer-events-none")

  if(selected.length == 2 && checkMatch()) {
    const cards = document.querySelectorAll(".card")
    if(Array.from(cards).every(el => !el.classList.contains("selected"))) {
      clearInterval(time)
      setTimeout(() => {
        cardCover.classList.add("hidden")
        timer.classList.add("hidden")
        scoreScreen.classList.remove("hidden")
        finalScore.textContent = `Your Time: ${seconds} seconds`
      }, 1000)
    }
    selected =  []
  } else if (selected.length == 2) {
    disableClick = true
    setTimeout(() => {
      hideCards()
      disableClick = false
    }, 1000)
  }
}

function checkMatch() {
  const matched = selected[0] == selected[1]
  return matched
}

function hideCards() {
  const cards = document.querySelectorAll(".card")
  cards.forEach(el => {
    if(selected.find(card => card == el.attributes["data-value"].value)) {
      el.classList.add("selected")
      el.classList.remove("pointer-events-none")
    }
  })
  selected =  []
}

function generateCards(cards) {
  const newCards = [...cards, ...cards]
  return newCards.sort(() => Math.random() - 0.5);
}

function startTime() {
  seconds++
  timer.textContent = `Timer: ${seconds}`
}

function goToHome() {
  startMenu.classList.remove("hidden")
  cardCover.classList.add("hidden")
  timer.classList.add("hidden")
  scoreScreen.classList.add("hidden")
  finalScore.textContent = ""
  cardCover.innerHTML = ""
  difficulties.forEach(el => el.classList.remove("selected"))
  selectedDifficulty = ""
  seconds = 0
  timer.textContent = "Timer: 0"
}

function restartGame() {
  scoreScreen.classList.add("hidden")
  seconds = 0
  timer.textContent = "Timer: 0"
  finalScore.textContent = ""
  cardCover.innerHTML = ""
  startGame()
}