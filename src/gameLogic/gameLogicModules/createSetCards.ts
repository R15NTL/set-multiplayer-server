import { Card, Color, Shading, Shape, Quantity } from "../types";

function makeNewSequentialCards(): Card[] {
  const output: Card[] = [];

  const colors: Color[] = ["red", "green", "purple"];
  const quantities: Quantity[] = [1, 2, 3];
  const shapes: Shape[] = ["oval", "diamond", "snake"];
  const shading: Shading[] = ["solid", "empty", "shaded"];

  var arrId = 0;

  for (const color of colors) {
    for (const quantity of quantities) {
      for (const shape of shapes) {
        for (const shade of shading) {
          output[output.length] = {
            color: color,
            quantity: quantity,
            shape: shape,
            shade: shade,
            arrId: arrId++,
          };
        }
      }
    }
  }
  return output;
}

function shuffleCards(cards: Card[]) {
  const shuffledCards = [...cards];

  for (const i in shuffledCards) {
    const currentCard = shuffledCards[i];
    const randomCardArrId = Math.floor(Math.random() * 81);

    shuffledCards[i] = shuffledCards[randomCardArrId];
    shuffledCards[randomCardArrId] = currentCard;

    shuffledCards[i].arrId = parseInt(i);
    shuffledCards[randomCardArrId].arrId = randomCardArrId;
  }
  return shuffledCards;
}

export default function createSetCards(): Card[] {
  const sequentailCards = makeNewSequentialCards();

  return shuffleCards(sequentailCards);
}
