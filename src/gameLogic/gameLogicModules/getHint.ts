import { Card } from "../types";

import checkIfSet from "./checkIfSet";

export default function getHint(setTable: Card[]): number[] {
  let hint: number[] = [];

  for (let cardA = 0; cardA < setTable.length - 2; cardA++) {
    for (let cardB = cardA + 1; cardB < setTable.length - 1; cardB++) {
      for (let cardC = cardB + 1; cardC < setTable.length; cardC++) {
        if (checkIfSet(setTable, cardA, cardB, cardC)) {
          hint = [cardA, cardB, cardC];
        }
      }
    }
  }

  return hint;
}
