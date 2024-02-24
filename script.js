const difficulties = document.querySelectorAll(".difficulty li")
const cards = document.querySelector(".cards")
const startBtn = document.querySelector(".start")
const startMenu = document.querySelector(".start-menu")

let selectedDifficulty = ""

difficulties.forEach(el => {
  el.addEventListener("click", (e) => {
    difficulties.forEach(rm => rm.classList.remove("selected"))
    e.target.classList.add("selected")
    selectedDifficulty = e.target.textContent
  })
})

startBtn.addEventListener("click", startGame)

function startGame() {
  if(!selectedDifficulty) return
  startMenu.classList.add("hidden")
  cards.classList.remove("hidden")
}


function selectCard() {

}

function checkMatch() {

}