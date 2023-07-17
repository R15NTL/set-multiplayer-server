import checkIfSet from "./checkIfSet";
import { Card } from "../types";

export default function calculateSetsOnTable(setTable: Card[]) {
  let setCounter = 0;

  for (let cardA = 0; cardA < setTable.length - 2; cardA++) {
    for (let cardB = cardA + 1; cardB < setTable.length - 1; cardB++) {
      for (let cardC = cardB + 1; cardC < setTable.length; cardC++) {
        if (checkIfSet(setTable, cardA, cardB, cardC)) {
          setCounter++;
        }
      }
    }
  }

  return setCounter;
}
