const difficulties = document.querySelectorAll(".difficulty li")
const cardCover = document.querySelector(".cards")
const cards = document.querySelectorAll(".card")
const startBtn = document.querySelector(".start")
const startMenu = document.querySelector(".start-menu")

{/* <div class="card bg-gray-400 rounded-md">
<div class="cover"></div>
</div> */}

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
  e.target.classList.remove("selected")
}

function checkMatch() {

}