import switchFoundCardsWithCardsOnTheLastRow, {
  WaitingTableCard,
} from "./switchFoundCardsWithCardsOnLast";
import { Card, Color, Shading, Shape, Quantity } from "../types";

// Mock data
const mockCard: Card = {
  color: "red",
  shape: "oval",
  quantity: 2,
  shade: "solid",
  arrId: 0,
};

describe("switchFoundCardsWithCardsOnTheLastRow function", () => {
  test("should switch 'waiting' cards with a non waiting card from the last row", () => {
    const mockTable: WaitingTableCard[] = [
      mockCard,
      mockCard,
      "waiting",
      mockCard,
      mockCard,
      mockCard,
      {
        ...mockCard,
        color: "green",
      },
      "waiting",
      "waiting",
    ];

    const result = switchFoundCardsWithCardsOnTheLastRow([], mockTable);

    // Expect the first card (which was 'waiting') to be the same as the last card of the original table
    expect(result[2]).toEqual(mockTable[6]);
    // Expect the new table to have 3 less cards
    expect(result.length).toEqual(mockTable.length - 3);
    // Check if there are no 'waiting' cards in the new table
    expect((result as any[]).includes("waiting")).toBeFalsy();
  });

  test("should remove 'waiting' cards when all cards on last row are 'waiting'", () => {
    const mockTable: WaitingTableCard[] = [
      mockCard,
      mockCard,
      mockCard,
      mockCard,
      mockCard,
      mockCard,
      "waiting",
      "waiting",
      "waiting",
    ];

    const result = switchFoundCardsWithCardsOnTheLastRow([], mockTable);

    // Expect the new table to be the same as the original table minus the last 3 cards
    expect(result).toEqual(mockTable.slice(0, 6));
    // Check if there are no 'waiting' cards in the new table
    expect((result as any[]).includes("waiting")).toBeFalsy();
  });
  test("should swap cards from the last row with cards that are waiting on the table", () => {
    const mockTable: WaitingTableCard[] = [
      mockCard,
      "waiting",
      mockCard,
      "waiting",
      mockCard,
      "waiting",
      mockCard,
      mockCard,
      mockCard,
    ];

    const result = switchFoundCardsWithCardsOnTheLastRow([], mockTable);

    // Expect the new table to have 3 less cards
    expect(result.length).toEqual(mockTable.length - 3);
    // Check if there are no 'waiting' cards in the new table
    expect((result as any[]).includes("waiting")).toBeFalsy();
  });
});
