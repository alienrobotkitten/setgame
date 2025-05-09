import { createDeck, isSet, findAllSets } from './scripts/set.js';
import { myConfetti } from './scripts/confetti.js';
import { defaultSettings } from './scripts/settings.js';

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

let cards;
let cardsOnTable;
let selected;
let score = 0;
let highscore = 0;
let availableSets;
let settings;
load();
renderPage();


function deal(amount) {
  console.log("Dealing...")
  if (!cardsOnTable) {
    setCardsOnTable(drawCard(amount));
  }
  else {
    setCardsOnTable([...cardsOnTable, ...drawCard(amount)]);
  }
  availableSets = findAllSets(cardsOnTable);
  setAvailableSets(availableSets);
  console.log("Dealing done.")
}

function drawCard(amount = 1) {
  if (amount == 1) {
    const newCard = cards.shift();
    setCards(cards);
    return newCard;
  }
  else if (cards && cards.length >= amount) {
    var drawnCards = [];
    for (let i = 0; i < amount; i++) {
      drawnCards.push(cards.shift())
    }
    setCards(cards);
    return drawnCards;
  }
}

function setSelected(newSelected) {
  selected = newSelected
  localStorage.setItem("selected", JSON.stringify(selected))
  console.log("saving selected", selected)
}

function setHighscore(newHighscore) {
  if (newHighscore == null) {
    console.error("New highscore is null")
    return;
  }
  if (newHighscore < 0) {
    console.error("New highscore is negative")
    return;
  }
  if (newHighscore == NaN) {
    console.error("New highscore is NaN")
    return;
  }
  if (newHighscore == undefined) {
    console.error("New highscore is undefined")
    return;
  }
  if (newHighscore > 0 && newHighscore > highscore) {
    highscore = newHighscore
    document.getElementById("highscore").innerText = highscore;
    localStorage.setItem("highscore", highscore)
    console.log("saving highscore", highscore)
  }
}

function setScore(newScore) {
  if (newScore > 0) {
    score = newScore
  } else {
    score = 0
  }
  document.getElementById("score").innerText = score;
  localStorage.setItem("score", score)
  console.log("saving score", score)
  if (highscore < score) {
    setHighscore(score);
  }
}

function setCards(newCards) {
  cards = newCards
  document.getElementById("amount_cards").innerText = cards.length;
  localStorage.setItem("cards", JSON.stringify(cards))
  console.log("saving cards", cards)
}

function setCardsOnTable(newCardsOnTable) {
  cardsOnTable = newCardsOnTable
  localStorage.setItem("cardsOnTable", JSON.stringify(cardsOnTable))
  console.log("saving cardsOnTable", cardsOnTable)
}

function setAvailableSets(newAvailableSets) {
  availableSets = newAvailableSets
  document.getElementById("amount_sets").innerText = availableSets.length;
  localStorage.setItem("availableSets", JSON.stringify(availableSets))
  console.log("saving availableSets", availableSets)
}

function saveSettings(newSettings) {
  settings = {
    ...defaultSettings,
    ...settings,
    ...newSettings
  }
  localStorage.setItem("settings", JSON.stringify(settings))
  console.log("saving settings", settings)
}

function setSetting(key, value) {
  let newSettings = {
    ...settings,
    [key]: value
  }
  saveSettings(newSettings)
  console.log("saving setting", key, value)
}

function getSetting(key) {
  if (defaultSettings.key == null) {
    console.error("Setting not found:", key)
    return null
  }
  if (settings.key == null) {
    let newSettings = {
      ...settings,
      [key]: defaultSettings.key
    }
    saveSettings(newSettings)
    return defaultSettings.key
  }
}

function load() {
  console.log("Loading...")

  try {
    saveSettings(JSON.parse(localStorage.getItem("settings")));
  } catch (err) {
    console.log("Settings not found, creating new settings...");
    console.log(err);
    saveSettings(defaultSettings);
  }
  console.log("Settings", settings);

  setHighscore(parseInt(localStorage.getItem("highscore")))
  console.log("High score", highscore)



  try {
    setSelected(JSON.parse(localStorage.getItem("selected")));
  } catch (err) {
    console.err(err);
    setSelected([]);
  }
  console.log("Selected", selected);

  let tryGetCards;
  let tryGetCardsOnTable;
  try {
    tryGetCards = JSON.parse(localStorage.getItem("cards"))
    tryGetCardsOnTable = JSON.parse(localStorage.getItem("cardsOnTable"))
    if (tryGetCards.length > 0) {
      console.log("cards found in local storage")
      setCards(tryGetCards);
    }
    if (tryGetCardsOnTable.length > 0) {
      console.log("cardsOnTable found in local storage")
      setCardsOnTable(tryGetCardsOnTable);
    } else {
      console.log("cardsOnTable not found, creating new deck")
      setCardsOnTable([])
      deal(12)
    }
  } catch {
    console.log("ongoing game data corrupted, resetting...")
    reset();
    console.log("Reset done.")
  }

  setScore(parseInt(localStorage.getItem("score")))
  console.log("Score", score);

  setAvailableSets(findAllSets(cardsOnTable));
  console.log("Loading done.")
}

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
document.getElementById("menu-button").addEventListener("click", toggleMenu);

function toggleMenu() {
  console.log("menyklick")
  let x = document.getElementById("menu-container").classList.toggle("open");
}

function closeMenu() {
  document.getElementById("menu-container").classList.remove("open");
}

function reset() {
  setCards(createDeck());
  setScore(0);
  setSelected([]);
  setCardsOnTable([]);
  deal(12);
  setAvailableSets(findAllSets(cardsOnTable));
}

// Menu alternatives
// Three more cards
document.getElementById("deal-more").addEventListener("click", function () {
  closeMenu();
  deal(3);
  renderPage();
});

// Hint
document.getElementById("hint").addEventListener("click", function () {
  closeMenu();
  if (availableSets.length > 0) {
    let randomSet = Math.floor(Math.random() * availableSets.length);
    console.log("Random set:", availableSets[randomSet]);
    let randomCard = Math.floor(Math.random() * 2);
    let cardIndex = availableSets[randomSet][randomCard];
    console.log("Random card of that set:", cardIndex);
    let cardId = cardsOnTable[cardIndex].id;
    setSelected([cardId]);
    renderPage();
  }
});

// New game
document.getElementById("new-game").addEventListener("click", function () {
  closeMenu();
  reset();
  renderPage();
});

// Help
document.getElementById("help").addEventListener("click", () => {
  console.log("showing help")
  document.getElementById("menu-container").classList.remove("open");
  document.getElementById("help-popup").showModal();
});

// Stats
document.getElementById("stats").addEventListener("click", () => {
  console.log("showing stats")
  document.getElementById("menu-container").classList.remove("open");
  document.getElementById("stats-popup").showModal();
});

document.getElementById("close-help-popup").addEventListener("click", function () {
  console.log("closing help")
  document.getElementById("help-popup").close();
})

document.getElementById("close-stats-popup").addEventListener("click", function () {
  console.log("closing stats")
  document.getElementById("stats-popup").close();
})

document.getElementById("close-deal-popup").addEventListener("click", function () {
  deal(3);
  renderPage();
  document.getElementById("deal-popup").close();
})

function showNoMoreSets() {
  console.log("no more sets")
  document.getElementById("deal-popup").showModal();
}

document.getElementById("close-gameover-popup").addEventListener("click", function () {
  console.log("closing gameover");
  reset();
  renderPage();
  document.getElementById("gameover-popup").close();
})

function showGameOver() {
  console.log("showing gameover");
  document.getElementById("gameover-popup").showModal();
  document.getElementById("gameover-score").innerText = score;
  document.getElementById("gameover-highscore").innerText = highscore;
};

document.getElementById("settings").addEventListener("click", function () {
  closeMenu();
  console.log("showing settings");
  document.getElementById("animations-setting-checkbox").checked = settings.animations;
  document.getElementById("settings-popup").showModal();
});

document.getElementById("animations-setting-checkbox").addEventListener("change", function () {
  console.log("animations setting changed", this.checked)
  setSetting("animations", this.checked);
});

document.getElementById("close-settings-popup").addEventListener("click", function () {
  console.log("closing settings")
  document.getElementById("settings-popup").close();
});

async function throwConfetti() {
  if (settings.animations) {
    console.log("throwing confetti!")
    myConfetti(0.5, 0.8);
  }
  else {
    console.log("no confetti since animations are turned off")
  }
}


function renderPage() {
  let html = "";
  for (let [_, value] of Object.entries(cardsOnTable)) {
    html += renderCard(value);
  }
  document.getElementById("card-container").innerHTML = html

  const elements = document.querySelectorAll(".card")
  for (let element of elements) {
    element.addEventListener("click", clickHandler)
  }

  for (let id of selected) {
    document.getElementById(id).classList.add("selected");
  }

  if (availableSets.length == 0 && cards.length == 0) {
    showGameOver();
  } else if (availableSets.length == 0) {
    showNoMoreSets();
  }
}

async function clickHandler(e) {
  const id = e.target.id || e.target.parentElement.id;
  console.log(id);

  if (!selected.includes(id)) {
    document.getElementById(id).classList.add("selected");
    setSelected([...selected, id]);
  } else {
    document.getElementById(id).classList.remove("selected");
    setSelected(selected.filter(entry => entry != id));
  }

  if (selected.length < 3) {
    console.log(selected);
    renderPage();
  }
  else if (selected.length == 3) {
    const id0 = selected[0];
    const id1 = selected[1];
    const id2 = selected[2];
    const card1 = cardsOnTable.filter(card => card.id == id0)[0];
    const card2 = cardsOnTable.filter(card => card.id == id1)[0];
    const card3 = cardsOnTable.filter(card => card.id == id2)[0];

    if (isSet(card1, card2, card3)) {
      console.log("Set!");
      setScore(score + 1);
      throwConfetti();
      document.getElementById(id0).classList.remove("selected");
      document.getElementById(id0).classList.add("right");
      document.getElementById(id1).classList.remove("selected");
      document.getElementById(id1).classList.add("right");
      document.getElementById(id2).classList.remove("selected");
      document.getElementById(id2).classList.add("right");
      setTimeout(() => {
        setSelected([]);
        if (cards.length > 0 && cardsOnTable.length <= 12) {
          console.log("Refilling...");
          var newCards = drawCard(3);
          var newCardsOnTable = [...cardsOnTable];
          newCardsOnTable.splice(newCardsOnTable.indexOf(card1), 1, newCards[0]);
          newCardsOnTable.splice(newCardsOnTable.indexOf(card2), 1, newCards[1]);
          newCardsOnTable.splice(newCardsOnTable.indexOf(card3), 1, newCards[2]);
          setCardsOnTable(newCardsOnTable);
        } else {
          var newCardsOnTable = [...cardsOnTable];
          newCardsOnTable.splice(newCardsOnTable.indexOf(card1), 1);
          newCardsOnTable.splice(newCardsOnTable.indexOf(card2), 1);
          newCardsOnTable.splice(newCardsOnTable.indexOf(card3), 1);
          setCardsOnTable(newCardsOnTable);
        }
        setAvailableSets(findAllSets(cardsOnTable));
        console.log("Available sets", availableSets)
        renderPage();
      }, 2000);
    } else {
      console.log("Not a set!");
      unSelectAll();
    }
  } else {
    console.log("You click too fast!");
    unSelectAll();
  }
}

function unSelectAll() {
  for (let id of selected) {
    document.getElementById(id).classList.remove("selected");
    document.getElementById(id).classList.add("wrong");
  }
  setTimeout(() => {
    for (let id of selected) {
      document.getElementById(id).classList.remove("wrong");
    }
    setSelected([]);
  }, 1000);
}

function renderCard(card) {
  var symbolsArray;
  if (card.symbol == "star") {
    symbolsArray = stars;
  } else if (card.symbol == "circle") {
    symbolsArray = circles;
  } else if (card.symbol == "battery") {
    symbolsArray = batteries;
  } else {
    console.error("Unknown symbol type:", card.symbol);
    return "";
  }
  return `<button class="card ${card.color}"
    id=${card.id}
    data-symbol=${card.symbol} 
    data-amount=${card.amount}
    data-fill=${card.fill}
    data-color=${card.color}
    >
      ${symbolsArray[card.fill].repeat(card.amount)}
    </button>`;
}

