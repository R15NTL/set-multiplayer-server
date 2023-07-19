import gameLogic, { GameSnapshot } from "../../src/gameLogic/gameLogic";
import createSetCards from "../../src/gameLogic/gameLogicModules/createSetCards";
import { Card } from "../../src/gameLogic/types";

describe("gameLogic", () => {
  let currentGame: GameSnapshot;

  const mockCard: Card = {
    color: "red",
    quantity: 1,
    shape: "oval",
    shade: "solid",
    arrId: 0,
  };

  beforeEach(() => {
    currentGame = {
      cardStack: createSetCards(),
      usedCards: 0,
      setTable: [],
      endOfGame: false,
    };
  });

  test("startGame", () => {
    const game = new gameLogic(currentGame);
    game.startGame();

    expect(game.saveGame().setTable.length >= 12).toBeTruthy();
  });

  test("saveGame", () => {
    const game = new gameLogic(currentGame);
    const savedGame = game.saveGame();
    expect(savedGame).toEqual(currentGame);
  });

  test("createNewTable", () => {
    const game = new gameLogic();
    const newTable = game.createNewTable();

    expect(game.saveGame().setTable.length >= 12).toBeTruthy();
    expect(game.saveGame().usedCards >= 12).toBeTruthy();
  });

  test("findSet", () => {
    currentGame = {
      cardStack: createSetCards(),
      usedCards: 0,
      setTable: [mockCard, mockCard, mockCard, mockCard]
        .map((card) => [card, card, card])
        .flat(),
      endOfGame: false,
    };

    const game = new gameLogic(currentGame);

    const cardPositions = {
      cardIdA: 0,
      cardIdB: 1,
      cardIdC: 2,
    };

    expect(game.findSet(cardPositions)).toBe(true);
    expect(game.saveGame().setTable.length).toBe(12);
    expect(game.saveGame().usedCards).toBe(3);
  });

  test("replaceFoundCardsWithNewCards", () => {
    currentGame = {
      cardStack: createSetCards(),
      usedCards: 0,
      setTable: [mockCard, mockCard, mockCard, mockCard]
        .map((card) => [card, card, card])
        .flat(),
      endOfGame: false,
    };

    const game = new gameLogic(currentGame);

    const cardPositions = {
      cardIdA: 0,
      cardIdB: 1,
      cardIdC: 2,
    };

    game.findSet(cardPositions);

    const snapshot = game.saveGame();
    expect(snapshot.setTable.length).toBe(12);
    expect(snapshot.usedCards).toBe(3);
    // Expect the first three cards to be replaced with new cards
    expect(snapshot.setTable[0]).not.toEqual(snapshot.setTable[1]);
  });

  test("findSet should return false if not a set", () => {
    currentGame = {
      cardStack: createSetCards(),
      usedCards: 12,
      setTable: [
        { ...mockCard, color: "green" } as Card,
        mockCard,
        mockCard,
        mockCard,
      ].flatMap((card) => [card, card, card]),

      endOfGame: false,
    };

    const game = new gameLogic(currentGame);

    const cardPositions = {
      cardIdA: 2,
      cardIdB: 3,
      cardIdC: 4,
    };

    expect(game.findSet(cardPositions)).toBe(false);
  });

  test("game should end if no sets left and card stack is exausted", () => {
    currentGame = {
      cardStack: createSetCards(),
      usedCards: 81,
      setTable: [
        mockCard,
        mockCard,
        mockCard,
        { ...mockCard, color: "green" },
        { ...mockCard, shape: "snake" },
        { ...mockCard, shade: "empty" },
      ],

      endOfGame: false,
    };

    const game = new gameLogic(currentGame);

    const cardPositions = {
      cardIdA: 0,
      cardIdB: 1,
      cardIdC: 2,
    };

    expect(game.findSet(cardPositions)).toBe(true);
    expect(game.saveGame().endOfGame).toBe(true);
    expect(game.saveGame().setTable.length).toBe(3);
  });

  test("getNewCards should return 3 new cards and increment the used cards by three", () => {
    const game = new gameLogic(currentGame);
    const newCards = game.getNewCards();

    expect(newCards?.length).toBe(3);
    expect(game.saveGame().usedCards).toBe(3);
  });

  test("getNewCards should return null if no cards left", () => {
    const game = new gameLogic({ ...currentGame, usedCards: 81 });

    const newCards = game.getNewCards();

    expect(newCards).toBe(null);
  });

  test("checkIfSet should return false if number index exeeds setTable length", () => {
    const game = new gameLogic({
      ...currentGame,
      setTable: [mockCard, mockCard, mockCard],
    });

    expect(game.checkIfSet(0, 1, 4)).toBe(false);
  });

  test("checkIfSet should return false if number index is negative", () => {
    const game = new gameLogic({
      ...currentGame,
      setTable: [mockCard, mockCard, mockCard],
    });

    expect(game.checkIfSet(0, 1, -1)).toBe(false);
  });

  test("checkIfSet should return false when duplicate cards are passed in", () => {
    const game = new gameLogic({
      ...currentGame,
      setTable: [mockCard, mockCard, mockCard],
    });

    expect(game.checkIfSet(0, 1, 0)).toBe(false);
  });

  test("checkIfSet should return false when is not a set", () => {
    const game = new gameLogic({
      ...currentGame,
      setTable: [{ ...mockCard, color: "green" }, mockCard, mockCard],
    });

    expect(game.checkIfSet(0, 1, 2)).toBe(false);
  });

  test("checkIfSet should return true when is a set", () => {
    const game = new gameLogic({
      ...currentGame,
      setTable: [mockCard, mockCard, mockCard],
    });

    expect(game.checkIfSet(0, 1, 2)).toBe(true);
  });

  test("findSet should remove found cards and replace it with cards on the last row when set table length exeeds 12", () => {
    const setTable = [
      mockCard,
      mockCard,
      mockCard,

      mockCard,
      mockCard,
      mockCard,

      mockCard,
      mockCard,
      mockCard,

      mockCard,
      mockCard,
      mockCard,

      { ...mockCard, color: "green" } as Card,
      { ...mockCard, color: "green" } as Card,
      { ...mockCard, color: "green" } as Card,
    ];
    const game = new gameLogic({
      ...currentGame,
      setTable,
    });

    const cardPositions = {
      cardIdA: 0,
      cardIdB: 1,
      cardIdC: 2,
    };

    game.findSet(cardPositions);

    const snapshot = game.saveGame();
    expect(snapshot.setTable.length).toBe(12);
    expect(snapshot.setTable[0].color).toBe("green");
    expect(snapshot.setTable[1].color).toBe("green");
    expect(snapshot.setTable[2].color).toBe("green");
  });

  test("findSet should remove found cards and replace it with cards on the last row when set table length exeeds 12 and when one found card is on the last row", () => {
    const setTable = [
      { ...mockCard, color: "green" } as Card,
      { ...mockCard, color: "green" } as Card,
      mockCard,
      mockCard,

      mockCard,
      mockCard,
      mockCard,

      mockCard,
      mockCard,
      mockCard,

      mockCard,
      mockCard,

      mockCard,
      mockCard,
      { ...mockCard, color: "green" } as Card,
    ];
    const game = new gameLogic({
      ...currentGame,
      setTable,
    });

    const cardPositions = {
      cardIdA: 0,
      cardIdB: 1,
      cardIdC: 14,
    };

    game.findSet(cardPositions);

    const snapshot = game.saveGame();
    expect(snapshot.setTable.length).toBe(12);

    // All green cards should be removed
    expect(
      snapshot.setTable.every((card) => card.color === setTable[2].color)
    ).toBe(true);
  });
});
