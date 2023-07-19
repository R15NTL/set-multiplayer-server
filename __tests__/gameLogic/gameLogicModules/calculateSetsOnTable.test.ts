import { Card } from "../../../src/gameLogic/types";
import calculateSetsOnTable from "../../../src/gameLogic/gameLogicModules/calculateSetsOnTable";

describe("calculateSetsOnTable", () => {
  it("returns 1 set for a table of 3 duplicate cards", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(calculateSetsOnTable(setTable)).toBe(1);
  });
  it("returns 2 sets for a table that has two sets", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
      { color: "purple", quantity: 2, shape: "oval", shade: "solid", arrId: 0 },
      { color: "purple", quantity: 2, shape: "oval", shade: "solid", arrId: 1 },
      { color: "purple", quantity: 2, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(calculateSetsOnTable(setTable)).toBe(2);
  });
  it("returns 0 sets for a table that has no sets", () => {
    const setTable: Card[] = [
      {
        color: "purple",
        quantity: 2,
        shape: "diamond",
        shade: "empty",
        arrId: 0,
      },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(calculateSetsOnTable(setTable)).toBe(0);
  });
});
