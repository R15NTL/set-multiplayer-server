import gameLogic, { CardPositions, CurrentGame } from "./gameLogic";
import createSetCards from "./gameLogicModules/createSetCards";
import { Card } from "./types";

// mock your createSetCards method here if necessary
// jest.mock('./gameLogicModules/createSetCards');

describe("gameLogic", () => {
  let currentGame: CurrentGame;

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

  test("findSet", () => {
    currentGame = {
      cardStack: createSetCards(),
      usedCards: 0,
      setTable: [mockCard, mockCard, mockCard]
        .map((cardArray) => [cardArray, cardArray, cardArray, cardArray])
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
});
