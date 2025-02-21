const stars = {
  empty:`<i class="fa-regular fa-star"></i>`,
  full:`<i class="fa-solid fa-star"></i>`,
  half:`<i class="fa-solid fa-star-half-stroke"></i>`
}
const circles = {
  full: `<i class="fa-solid fa-circle"></i>`,
  half:`<i class="fa-solid fa-circle-half-stroke"></i>`,
  empty: `<i class="fa-regular fa-circle"></i>`
}
const batteries= {
  full: `<i class="fa-solid fa-battery-full"></i>`,
  half: `<i class="fa-solid fa-battery-half"></i>`,
  empty: `<i class="fa-solid fa-battery-empty"></i>`
}

const colors = ["red", "green", "purple"];
const fills = ["full", "half", "empty"];
const symbols = {star: stars, circle: circles, battery: batteries};
const amount = [1, 2, 3];

const cards = [];

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
console.log(cards.length);

function shuffle(cardsArray) {
  for (let i = 0; i < 200; i++) {
    const randomIndex1 = Math.floor(Math.random() * cardsArray.length);
    const randomIndex2 = Math.floor(Math.random() * cardsArray.length);
    const temp = cardsArray[randomIndex1];
    cardsArray[randomIndex1] = cardsArray[randomIndex2];
    cardsArray[randomIndex2] = temp;
  }
}

function generateCard(card) {
  return `<div class="card ${card.color}" 
    data-symbol=${card.symbol} 
    data-amount=${card.amount}
    data-fill=${card.fill}
    data-color=${card.color}
    >
      ${card.symbolsArray[card.fill].repeat(card.amount)}
    </div>`;
}

shuffle(cards);
const deal = cards.slice(0, 12);

document.getElementById("card-container").innerHTML = deal.map(card => generateCard(card)).join('');

