const stars = {
  empty: `<i class="fa-regular fa-star"></i>`,
  full: `<i class="fa-solid fa-star"></i>`,
  half: `<i class="fa-solid fa-star-half-stroke"></i>`
}
const circles = {
  full: `<i class="fa-solid fa-circle"></i>`,
  half: `<i class="fa-solid fa-circle-half-stroke"></i>`,
  empty: `<i class="fa-regular fa-circle"></i>`
}
const batteries = {
  full: `<i class="fa-solid fa-battery-full"></i>`,
  half: `<i class="fa-solid fa-battery-half"></i>`,
  empty: `<i class="fa-solid fa-battery-empty"></i>`
}

const colors = ["red", "green", "purple"];
const fills = ["full", "half", "empty"];
const symbols = { star: stars, circle: circles, battery: batteries };
const amount = [1, 2, 3];

let cards;
let cardsOnTable;
let selected;
let score;
let highscore;
load();
renderPage();

function deal() {
  console.log("Dealing...")
  return {
    0: drawCard(),
    1: drawCard(),
    2: drawCard(),
    3: drawCard(),
    4: drawCard(),
    5: drawCard(),
    6: drawCard(),
    7: drawCard(),
    8: drawCard(),
    9: drawCard(),
    10: drawCard(),
    11: drawCard()
  };
}

function save() {
  console.log("Saving...")
  localStorage.setItem("score", score)
  localStorage.setItem("selected", JSON.stringify(selected))
  localStorage.setItem("cards", JSON.stringify(cards))
  localStorage.setItem("cardsOnTable", JSON.stringify(cardsOnTable))
  console.log("Saved.")
}

function load() {
  console.log("Loading...")
  score = parseInt(localStorage.getItem("score")) || 0
  console.log("Score", score);
  highscore = parseInt(localStorage.getItem("highscore")) || score
  console.log("High score", highscore)
  selected = JSON.parse(localStorage.getItem("selected")) || []
  console.log("Selected", selected);
  cards = JSON.parse(localStorage.getItem("cards")) || createDeck()
  console.log("cards", cards);
  cardsOnTable = JSON.parse(localStorage.getItem("cardsOnTable")) || deal()
  console.log(cardsOnTable);
  console.log("Loading done.")
}

function reset() {
  score = 0;
  selected = [];
  cards = createDeck();
  cardsOnTable = deal();
  save();
  renderPage();
}

function renderPage() {
  let html = "";
  for (let [key, value] of Object.entries(cardsOnTable)) {
    html += renderCard(value, key);
  }
  document.getElementById("card-container").innerHTML = html

  const elements = document.querySelectorAll(".card")
  for (let element of elements) {
    element.addEventListener("click", clickHandler)
  }

  for (let id of selected) {
    document.getElementById(id).classList.add("selected");
  }

  document.getElementById("score").innerText = score;
  document.getElementById("highscore").innerText = highscore;
  document.getElementById("amount_sets").innerText = calculateSets();
  document.getElementById("amount_cards").innerText = cards.length;
}

function calculateSets() {
  let foundSets = 0;
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      for (let k = j + 1; k < 12; k++) {
        if (i != j && j != k) {
          if (isSet(cardsOnTable[i],
            cardsOnTable[j],
            cardsOnTable[k])) {
            foundSets++
          }
        }
      }
    }
  }
  return foundSets;
}


function clickHandler(e) {
  const id = e.target.id || e.target.parentElement.id
  console.log(id)
  if (!selected.includes(id)) {
    document.getElementById(id).classList.add("selected");
    selected.push(id);
  } else {
    document.getElementById(id).classList.remove("selected");
    selected = selected.filter(entry => entry != id)
  }
  console.log(selected)
  save();
  if (selected.length == 3) {
    const id0 = selected[0]
    const id1 = selected[1]
    const id2 = selected[2]
    const card1 = cardsOnTable[id0]
    const card2 = cardsOnTable[id1]
    const card3 = cardsOnTable[id2]
    if (isSet(card1, card2, card3)) {
      console.log("Set!")
      score++;
      if (highscore < score) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
      }
      document.getElementById(id0).classList.remove("selected")
      document.getElementById(id0).classList.add("right")
      document.getElementById(id1).classList.remove("selected")
      document.getElementById(id1).classList.add("right")
      document.getElementById(id2).classList.remove("selected")
      document.getElementById(id2).classList.add("right")
      setTimeout(() => {
        selected = []
        if (cards.length > 0) {

          cardsOnTable[id0] = drawCard()
          cardsOnTable[id1] = drawCard()
          cardsOnTable[id2] = drawCard()
        }
        save();
        renderPage();
      }, 1000)
    } else {
      console.log("Not a set")
      document.getElementById(id0).classList.remove("selected")
      document.getElementById(id0).classList.add("wrong")
      document.getElementById(id1).classList.remove("selected")
      document.getElementById(id1).classList.add("wrong")
      document.getElementById(id2).classList.remove("selected")
      document.getElementById(id2).classList.add("wrong")
      setTimeout(() => {
        document.getElementById(id0).classList.remove("wrong")
        document.getElementById(id1).classList.remove("wrong")
        document.getElementById(id2).classList.remove("wrong")
        selected = []
        save();
      }, 1000)
    }
  }
}

function isSet(card1, card2, card3) {
  if (
    (
      allSame(card1.amount, card2.amount, card3.amount)
      || allDifferent(card1.amount, card2.amount, card3.amount)
    ) && (
      allSame(card1.fill, card2.fill, card3.fill)
      || allDifferent(card1.fill, card2.fill, card3.fill)
    ) && (
      allSame(card1.symbol, card2.symbol, card3.symbol)
      || allDifferent(card1.symbol, card2.symbol, card3.symbol)
    ) && (
      allSame(card1.color, card2.color, card3.color)
      || allDifferent(card1.color, card2.color, card3.color)
    )
  ) {
    return true
  } else {
    return false
  }
}

function allSame(card1, card2, card3) {
  return card1 === card2 && card2 === card3
}

function allDifferent(card1, card2, card3) {
  return card1 != card2 && card2 != card3 && card1 != card3
}


function drawCard() {
  const newCard = cards.shift();
  console.log(cards.length)
  return newCard;
}

function createDeck() {
  let cards = []
  for (let i of amount) {
    for (let color of colors) {
      for (let fill of fills) {
        for (let key in symbols) {
          cards.push({
            amount: i,
            color: color,
            symbol: key,
            fill: fill,
            symbolsArray: symbols[key],
          });
        }
      }
    }
  }
  shuffle(cards);
  return cards;
}

function shuffle(cardsArray) {
  for (let i = 0; i < 200; i++) {
    const randomIndex1 = Math.floor(Math.random() * cardsArray.length);
    const randomIndex2 = Math.floor(Math.random() * cardsArray.length);
    const temp = cardsArray[randomIndex1];
    cardsArray[randomIndex1] = cardsArray[randomIndex2];
    cardsArray[randomIndex2] = temp;
  }
}

function renderCard(card, index) {
  return `<button class="card ${card.color}"
    id=${index}
    data-symbol=${card.symbol} 
    data-amount=${card.amount}
    data-fill=${card.fill}
    data-color=${card.color}
    >
      ${card.symbolsArray[card.fill].repeat(card.amount)}
    </button>`;
}
