import { Card } from "../types";

export type WaitingTableCard = "waiting" | Card;

function cardsToSwitchWith(cardPosArray: number[], table: WaitingTableCard[]) {
  let cardsOnLastRowToMove: Card[] = [];
  const setTable = table;

  for (let i = 1; i <= 3; i++) {
    const currentCard = setTable[setTable.length - i];

    if (currentCard !== "waiting") {
      cardsOnLastRowToMove[cardsOnLastRowToMove.length] = currentCard;
    }
  }

  return cardsOnLastRowToMove;
}

export default function switchFoundCardsWithCardsOnTheLastRow(
  cardPosArray: number[],
  table: WaitingTableCard[]
): Card[] {
  const cardsOnLastRowToMove = cardsToSwitchWith(cardPosArray, table);

  const setTable = [...table];

  for (let i = 0; i <= setTable.length - 4; i++) {
    if (setTable[i] === "waiting") {
      setTable[i] = cardsOnLastRowToMove[cardsOnLastRowToMove.length - 1];

      cardsOnLastRowToMove.length--;
    }
  }

  setTable.length--;
  setTable.length--;
  setTable.length--;

  return setTable as Card[];
}
