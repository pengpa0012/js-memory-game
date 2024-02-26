const difficulties = document.querySelectorAll(".difficulty li")
const cardCover = document.querySelector(".cards")
const timer = document.querySelector(".timer")
const cardsClick = document.querySelector("div")
const startBtn = document.querySelector(".start")
const startMenu = document.querySelector(".start-menu")
const scoreScreen = document.querySelector(".score-screen")
const finalScore = document.querySelector(".score-screen h4")

let selected = []
let disableClick = false
let time
let seconds = 0
let isGameEnd = false

const cardData = [
  {
    id: 0,
    link: "https://fastly.picsum.photos/id/1/100/150.jpg?hmac=hFr14POiqU2CtVuGXnBN41RjHEbmQcxz0p4GA3stTXw"
  }, 
  {
    id: 1,
    link: "https://fastly.picsum.photos/id/974/100/150.jpg?hmac=3Bz8zeyeLMZ-Q8SSAHT_1HXiU2y8QQKl1vUGForuMiw"
  }, 
  {
    id: 2,
    link: "https://fastly.picsum.photos/id/621/100/150.jpg?hmac=iKfuuUf2YMCJsWvHcZZ-VuomRnZr79E-Wuxbb1UqxnU"
  }, 
  {
    id: 3,
    link: "https://fastly.picsum.photos/id/893/100/150.jpg?hmac=bE57GdTSISElhZaLhSG5t9WoKrbiPBqsvI8J7Q7tC7g"
  }, 
  {
    id: 4,
    link: "https://fastly.picsum.photos/id/419/100/150.jpg?hmac=iN50Q3xers16MJm6MJSr_8oiDNCbekLmeIIzeGUBsdU"
  }, 
  {
    id: 5,
    link: "https://fastly.picsum.photos/id/894/100/150.jpg?hmac=QCZQypggIDDR-qEqg-0ZT32CsofVVU4EzHVEcPMeNFo"
  }
]

let selectedDifficulty = ""

difficulties.forEach(el => {
  el.addEventListener("click", (e) => {
    difficulties.forEach(rm => rm.classList.remove("selected"))
    e.target.classList.add("selected")
    selectedDifficulty = e.target.textContent
  })
})

startBtn.addEventListener("click", startGame)
cardsClick.addEventListener("click", selectCard)

function startGame() {
  if(!selectedDifficulty) return
  time = setInterval(startTime, 1000)
  generateCards(cardData).forEach(el => {
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
      isGameEnd = true
      cardCover.classList.add("hidden")
      timer.classList.add("hidden")
      scoreScreen.classList.remove("hidden")
      finalScore.textContent = seconds
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

function shuffleCards() {

}

function generateCards(cards) {
  const newCards = [...cards, ...cards]
  return newCards.sort(() => Math.random() - 0.5);
}

function startTime() {
  seconds++
  timer.textContent = `Timer: ${seconds}`
}