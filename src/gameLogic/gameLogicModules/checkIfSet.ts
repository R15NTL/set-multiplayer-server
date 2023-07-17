import { Card } from "../types";

export default function checkIfSet(
  setTable: Card[],
  cardId1: number,
  cardId2: number,
  cardId3: number
): boolean {
  const color =
    (setTable[cardId1].color === setTable[cardId2].color &&
      setTable[cardId2].color === setTable[cardId3].color) ||
    (setTable[cardId1].color !== setTable[cardId2].color &&
      setTable[cardId1].color !== setTable[cardId3].color &&
      setTable[cardId2].color !== setTable[cardId3].color);

  if (!color) return false;

  const quantity =
    (setTable[cardId1].quantity === setTable[cardId2].quantity &&
      setTable[cardId2].quantity === setTable[cardId3].quantity) ||
    (setTable[cardId1].quantity !== setTable[cardId2].quantity &&
      setTable[cardId1].quantity !== setTable[cardId3].quantity &&
      setTable[cardId2].quantity !== setTable[cardId3].quantity);

  if (!quantity) return false;

  const shape =
    (setTable[cardId1].shape === setTable[cardId2].shape &&
      setTable[cardId2].shape === setTable[cardId3].shape) ||
    (setTable[cardId1].shape !== setTable[cardId2].shape &&
      setTable[cardId1].shape !== setTable[cardId3].shape &&
      setTable[cardId2].shape !== setTable[cardId3].shape);

  if (!shape) return false;

  const shade =
    (setTable[cardId1].shade === setTable[cardId2].shade &&
      setTable[cardId2].shade === setTable[cardId3].shade) ||
    (setTable[cardId1].shade !== setTable[cardId2].shade &&
      setTable[cardId1].shade !== setTable[cardId3].shade &&
      setTable[cardId2].shade !== setTable[cardId3].shade);

  if (!shade) return false;

  return true;
}
