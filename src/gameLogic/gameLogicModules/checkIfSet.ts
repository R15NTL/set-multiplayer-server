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
