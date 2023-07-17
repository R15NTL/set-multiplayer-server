import { Card } from "../types";

export type WaitingTableCard = "waiting" | Card;

// Extract cards from last row, which are to be moved
function cardsToSwitchWith(table: WaitingTableCard[]) {
  const cardsOnLastRowToMove: Card[] = [];
  const setTable = table;

  for (let i = 1; i <= 3; i++) {
    const currentCard = setTable[setTable.length - i];

    if (currentCard !== "waiting") {
      cardsOnLastRowToMove.push(currentCard);
    }
  }

  return cardsOnLastRowToMove;
}

export default function switchFoundCardsWithCardsOnTheLastRow(
  cardPosArray: number[],
  table: WaitingTableCard[]
): Card[] {
  const cardsOnLastRowToMove = cardsToSwitchWith(table);

  const setTable = [...table];

  // Iterate over the table except the last row
  for (let position = 0; position < setTable.length - 3; position++) {
    if (setTable[position] === "waiting") {
      // Replace 'waiting' cards with last row's cards
      setTable[position] =
        cardsOnLastRowToMove[cardsOnLastRowToMove.length - 1];

      cardsOnLastRowToMove.pop();
    }
  }

  // Remove last row (3 cards) from table
  setTable.splice(-3, 3);

  return setTable as Card[];
}
