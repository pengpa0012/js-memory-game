import { cardData } from "./assets/js/card-data.js"
const difficulties = document.querySelectorAll(".difficulty li")
const mainCover = document.querySelector(".main-cover")
const cardCover = document.querySelector(".cards")
const timer = document.querySelector(".timer")
const repeatPassword = document.querySelector("input[placeholder='repeat_password']")

const cardsClick = document.querySelector("div")
const startBtn = document.querySelector(".start")
const homeBtn = document.querySelector("div")
const restartBtn = document.querySelector(".restart-btn")
const leaderboardBtn = document.querySelector(".leaderboard-btn")
const loginBtn = document.querySelector(".login-btn")
const logoutBtn = document.querySelector(".logout-btn")
const createAccountBtn = document.querySelector(".create-account-btn")
const loginAccountBtn = document.querySelector(".login-account-btn")

const startMenu = document.querySelector(".start-menu")
const modalOverlay = document.querySelector(".modal-overlay")
const modal = document.querySelector(".modal")
const scoreScreen = document.querySelector(".score-screen")
const headerTitle = document.querySelector(".header-title")
const leaderboardScreen = document.querySelector(".leaderboard-screen")
const finalScore = document.querySelector(".score-screen h4")
const form = document.querySelector("form")

const correctSFX = new Audio("./assets/sounds/correct-sfx.mp3");
const wrongSFX = new Audio("./assets/sounds/wrong-sfx.mp3");

let selected = []
let disableClick = false
let time
let seconds = 0
timer.textContent = "Timer: 0"
const animationDirection = ["left", "right", "up", "down"]

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
headerTitle.addEventListener("click", goToHome)
restartBtn.addEventListener("click", restartGame)
leaderboardBtn.addEventListener("click", goToLeaderboard)
cardsClick.addEventListener("click", selectCard)
loginBtn.addEventListener("click", () => toggleForm(true))
logoutBtn.addEventListener("click", logout)
modalOverlay.addEventListener("click", (e) => toggleForm(false, e))
form.addEventListener("submit", (e) => submitForm(e))
createAccountBtn.addEventListener("click", () => createAccount(false))
loginAccountBtn.addEventListener("click", () => createAccount(true))

function startGame() {
  if(!selectedDifficulty) return
  time = setInterval(startTime, 1000)
  if(selectedDifficulty == "Hard") mainCover.classList.add("max-w-xl")
  else mainCover.classList.remove("max-w-xl")

  generateCards(cardData[selectedDifficulty]).forEach(el => {
    const newDiv = document.createElement("div")
    newDiv.innerHTML = `
      <div class="rounded-md card selected" data-value="${el.id}">
      <div class="cover"></div>
      </div>
    `
    newDiv.style.background = `url(${el.link})`
    newDiv.className = "rounded-md"
    if(selectedDifficulty == "Hard") {
      newDiv.className = `rounded-md card-cover ${animationDirection[Math.floor(Math.random() * 4)]} transition`
    }
    cardCover.appendChild(newDiv)
  })
  startMenu.classList.add("hidden")
  leaderboardBtn.classList.add("hidden")
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
    correctSFX.play()
    if(Array.from(cards).every(el => !el.classList.contains("selected"))) {
      clearInterval(time)
      setTimeout(() => {
        cardCover.classList.add("hidden")
        timer.classList.add("hidden")
        scoreScreen.classList.remove("hidden")
        finalScore.textContent = `Your Time: ${seconds} seconds`

        fetch("http://localhost:3000/createScore", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: seconds.toString(),
            difficulty: selectedDifficulty
          })
        })
        .catch(err => console.log(err))
      }, 1000)
    }
    selected =  []
  } else if (selected.length == 2) {
    disableClick = true
    wrongSFX.play()
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


function goToHome(e) { 
  if(e.target.closest(".home-btn") || e.target.closest(".header-title")) {
    startMenu.classList.remove("hidden")
    if(e.target.attributes["data-screen"].value == "end") {
      leaderboardBtn.classList.remove("hidden")
    } else {
      leaderboardScreen.classList.add("hidden")
    }
    cardCover.classList.add("hidden")
    timer.classList.add("hidden")
    scoreScreen.classList.add("hidden")
    finalScore.textContent = ""
    cardCover.innerHTML = ""
    difficulties.forEach(el => el.classList.remove("selected"))
    selectedDifficulty = ""
    seconds = 0
    timer.textContent = "Timer: 0"
    clearInterval(time)
  }
}

function restartGame() {
  scoreScreen.classList.add("hidden")
  seconds = 0
  timer.textContent = "Timer: 0"
  finalScore.textContent = ""
  cardCover.innerHTML = ""
  startGame()
}

function toggleForm(show, e) {
  if(show) {
    modalOverlay.classList.add("show")
    modal.classList.add("show")
  } else {
    if(e.target.closest(".modal")) return
    modalOverlay.classList.remove("show")
    modal.classList.remove("show")
    form.children[0].value = ""
    form.children[1].value = ""
    form.children[2].value = ""
  }
}

function submitForm(e) {
  e.preventDefault()

  const formTitle = document.querySelector(".form-title")
  const isLogin = formTitle.textContent == "Login" ? true : false
  let username = e.target[0].value
  let password = e.target[1].value
  let repeat_password = e.target[2].value

  if(!username || !password) return
  
  if(!isLogin && !repeat_password) return alert("Password does not match")
    
  fetch(`http://localhost:3000/${isLogin ? "login" : "signup"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  .then(data => {
    if(data.status == 500) alert("Error Login")
    else {
      e.target[0].value = ""
      e.target[1].value = ""
      e.target[2].value = ""
      alert(`${isLogin ? "Login" : "Signup"} Success`)
      if(isLogin) {
        modalOverlay.classList.remove("show")
        modal.classList.remove("show")
        loginBtn.classList.remove("hidden")
      } else {
        formTitle.textContent = "Login"
        repeatPassword.classList.add("hidden")
        loginAccountBtn.classList.add("hidden")
        createAccountBtn.classList.remove("hidden")
      }
    }
  })
  .catch(err => console.log(err))
}

function createAccount(isLogin) {
  const formTitle = document.querySelector(".form-title")
  if(isLogin) {
    formTitle.textContent = "Login"
    repeatPassword.classList.add("hidden")
    loginAccountBtn.classList.add("hidden")
    createAccountBtn.classList.remove("hidden")
  } else {
    createAccountBtn.classList.add("hidden")
    repeatPassword.classList.remove("hidden")
    loginAccountBtn.classList.remove("hidden")
    formTitle.textContent = "Signup"
  }
}

function logout () {
  // clear access token here
  logoutBtn.classList.add("hidden")
  loginBtn.classList.remove("hidden")
  fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .catch(err => console.log(err))
  alert("Logout Successfully")
}

function goToLeaderboard() {
  // add sort here by: score, date
  const scoreLists = document.querySelector(".score-lists")
  scoreLists.innerHTML = "<p class='text-center'>Loading...</p>"
  fetch("http://localhost:3000/getScores", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(res => res.json())
  .then(data => {
    const result = data.data
    result.forEach(el => {
      const newLi = document.createElement("li")
      newLi.classList.add("py-2")
      newLi.innerHTML = `
        <ul class="flex justify-between">
          <li>Date: ${el.date_created}</li>
          <li>Time: ${el.score}</li>
          <li>Difficulty: ${el.difficulty}</li>
        </ul>
      `
      scoreLists.appendChild(newLi)
    })
  }).catch((err) => {
    scoreLists.innerHTML = "<p class='text-center'>Login or create an account to view the leaderboard.</p>"
  })
  leaderboardScreen.classList.remove("hidden")
  startMenu.classList.add("hidden")
}

// update btn ui
// add bg music
// update card cover ui
// deploy