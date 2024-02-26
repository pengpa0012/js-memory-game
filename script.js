const difficulties = document.querySelectorAll(".difficulty li")
const cardCover = document.querySelector(".cards")
const cards = document.querySelectorAll(".card")
const startBtn = document.querySelector(".start")
const startMenu = document.querySelector(".start-menu")

let selected = []
let disableClick = false


let selectedDifficulty = ""

difficulties.forEach(el => {
  el.addEventListener("click", (e) => {
    difficulties.forEach(rm => rm.classList.remove("selected"))
    e.target.classList.add("selected")
    selectedDifficulty = e.target.textContent
  })
})

startBtn.addEventListener("click", startGame)

cards.forEach(el => {
  el.addEventListener("click", selectCard)
})

function startGame() {
  if(!selectedDifficulty) return
  startMenu.classList.add("hidden")
  cardCover.classList.remove("hidden")
}


function selectCard(e) {
  if(selected.length == 2 || disableClick) return

  selected.push(e.target.attributes["data-value"].value)
  e.target.classList.remove("selected")

  if(selected.length == 2 && checkMatch()) {
    // do nothing
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
  cards.forEach(el => {
    if(selected.find(card => card == el.attributes["data-value"].value)) {
      el.classList.add("selected")
    }
  })
  selected =  []
}

function shuffleCards() {

}