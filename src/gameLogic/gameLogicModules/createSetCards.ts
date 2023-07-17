import { Card, Color, Shading, Shape, Quantity } from "../types";

function makeNewSequentialCards(): Card[] {
  const output: Card[] = [];

  const colors: Color[] = ["red", "green", "purple"];
  const quantities: Quantity[] = [1, 2, 3];
  const shapes: Shape[] = ["oval", "diamond", "snake"];
  const shading: Shading[] = ["solid", "empty", "shaded"];

  let arrId = 0;

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

  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = shuffledCards[i];
    shuffledCards[i] = shuffledCards[j];
    shuffledCards[j] = temp;
  }

  // Re-assign arrId attribute
  shuffledCards.forEach((card, i) => {
    card.arrId = i;
  });

  return shuffledCards;
}

export default function createSetCards(): Card[] {
  const sequentailCards = makeNewSequentialCards();

  return shuffleCards(sequentailCards);
}
