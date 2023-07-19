import { Card } from "../../../src/gameLogic/types";
import checkIfSet from "../../../src/gameLogic/gameLogicModules/checkIfSet";

describe("checkIfSet", () => {
  it("returns true when all cards share properties", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(checkIfSet(setTable, 0, 1, 2)).toBeTruthy();
  });

  it("returns true when all properties are unique", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      {
        color: "green",
        quantity: 2,
        shape: "diamond",
        shade: "empty",
        arrId: 1,
      },
      {
        color: "purple",
        quantity: 3,
        shape: "snake",
        shade: "shaded",
        arrId: 2,
      },
    ];

    expect(checkIfSet(setTable, 0, 1, 2)).toBeTruthy();
  });

  it("returns false when one property is shared and the rest are unique", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      {
        color: "red",
        quantity: 2,
        shape: "diamond",
        shade: "empty",
        arrId: 1,
      },
      {
        color: "purple",
        quantity: 3,
        shape: "snake",
        shade: "shaded",
        arrId: 2,
      },
    ];

    expect(checkIfSet(setTable, 0, 1, 2)).toBeFalsy();
  });

  it("returns false when all properties are shared but one is unique", () => {
    const setTable: Card[] = [
      { color: "green", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(checkIfSet(setTable, 0, 1, 2)).toBeFalsy();
  });

  it("returns false when an index exceeds table length", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(checkIfSet(setTable, 0, 1, 3)).toBe(false);
  });

  it("returns false when an index is negative", () => {
    const setTable: Card[] = [
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 0 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 1 },
      { color: "red", quantity: 1, shape: "oval", shade: "solid", arrId: 2 },
    ];

    expect(checkIfSet(setTable, 0, 1, -1)).toBe(false);
  });
});
