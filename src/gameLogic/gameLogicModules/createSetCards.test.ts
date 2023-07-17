import createSetCards from "./createSetCards";

describe("createSetCards", () => {
  it("creates a deck with 81 unique cards", () => {
    const deck = createSetCards();

    expect(deck.length).toBe(81);

    // Check uniqueness
    const cardStrings = deck.map((card) => JSON.stringify(card));
    const uniqueCardStrings = Array.from(new Set(cardStrings));
    expect(cardStrings.length).toBe(uniqueCardStrings.length);
  });

  it("shuffles the cards", () => {
    const deck1 = createSetCards();
    const deck2 = createSetCards();

    // Note: This test could theoretically fail even if the function is correct, because
    // it's possible (but highly unlikely) for the shuffling to produce the same order twice ;-)
    expect(JSON.stringify(deck1)).not.toBe(JSON.stringify(deck2));
  });
});
