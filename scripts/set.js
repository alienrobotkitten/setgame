export function createDeck() {
  const colors = ["red", "green", "purple"];
  const fills = ["full", "half", "empty"];
  const symbols = ["star", "circle", "battery"];
  const amount = [1, 2, 3];
  let cards = [];
  let index = 0;

  for (let i of amount) {
    for (let color of colors) {
      for (let fill of fills) {
        for (let symbol of symbols) {
          cards.push({
            id: index,
            amount: i,
            color: color,
            symbol: symbol,
            fill: fill,
          });
          index++;
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

export function isSet(card1, card2, card3) {
  return (
    (allSame(card1.amount, card2.amount, card3.amount) ||
      allDifferent(card1.amount, card2.amount, card3.amount)) &&
    (allSame(card1.fill, card2.fill, card3.fill) ||
      allDifferent(card1.fill, card2.fill, card3.fill)) &&
    (allSame(card1.symbol, card2.symbol, card3.symbol) ||
      allDifferent(card1.symbol, card2.symbol, card3.symbol)) &&
    (allSame(card1.color, card2.color, card3.color) ||
      allDifferent(card1.color, card2.color, card3.color))
  );
}

function allSame(attr1, attr2, attr3) {
  return attr1 === attr2 && attr2 === attr3;
}

function allDifferent(attr1, attr2, attr3) {
  return attr1 !== attr2 && attr2 !== attr3 && attr1 !== attr3;
}

export function findAllSets(cardsOnTable) {
  const availableSets = [];
  const availableCards = cardsOnTable.length;

  for (let i = 0; i < availableCards; i++) {
    for (let j = i + 1; j < availableCards; j++) {
      for (let k = j + 1; k < availableCards; k++) {
        if (isSet(cardsOnTable[i], cardsOnTable[j], cardsOnTable[k])) {
          availableSets.push([i, j, k]);
        }
      }
    }
  }
  return availableSets;
}
