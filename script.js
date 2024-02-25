const difficulties = document.querySelectorAll(".difficulty li")
const cardCover = document.querySelector(".cards")
const cards = document.querySelectorAll(".card")
const startBtn = document.querySelector(".start")
const startMenu = document.querySelector(".start-menu")

let selected = []

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
  selected.push(e.target.attributes["data-value"].value)
  console.log(selected.length, checkMatch(), selected)
  e.target.classList.remove("selected")
  if(selected.length == 2) {
    if(checkMatch()) {
      // do nothing
    } else {
      e.target.classList.remove("selected")
     
      setTimeout(() => {
        hideCards()
      }, 1000)
    }
    selected = []
    return
  }
}

function checkMatch() {
  const matched = selected[0] == selected[1]
  return matched
}

function hideCards() {
  cards.forEach(el => {
    el.classList.add("selected")
  })
}

function shuffleCards() {

}