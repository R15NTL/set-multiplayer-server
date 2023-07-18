import { Card } from "../types";

function areAllEqualOrUnique(a: any, b: any, c: any): boolean {
  return (a === b && b === c) || (a !== b && a !== c && b !== c);
}

export default function checkIfSet(
  setTable: Card[],
  cardId1: number,
  cardId2: number,
  cardId3: number
): boolean {
  // Ensure that the cardIds are within the range of the setTable.
  const maxCardId = setTable.length - 1;
  if (
    cardId1 > maxCardId ||
    cardId2 > maxCardId ||
    cardId3 > maxCardId ||
    cardId1 < 0 ||
    cardId2 < 0 ||
    cardId3 < 0
  ) {
    return false;
  }

  // Ensure that all cards are unique.
  if (cardId1 === cardId2 || cardId1 === cardId3 || cardId2 === cardId3) {
    return false;
  }

  return (
    areAllEqualOrUnique(
      setTable[cardId1].color,
      setTable[cardId2].color,
      setTable[cardId3].color
    ) &&
    areAllEqualOrUnique(
      setTable[cardId1].quantity,
      setTable[cardId2].quantity,
      setTable[cardId3].quantity
    ) &&
    areAllEqualOrUnique(
      setTable[cardId1].shape,
      setTable[cardId2].shape,
      setTable[cardId3].shape
    ) &&
    areAllEqualOrUnique(
      setTable[cardId1].shade,
      setTable[cardId2].shade,
      setTable[cardId3].shade
    )
  );
}
