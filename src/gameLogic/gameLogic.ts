import createSetCards from "./gameLogicModules/createSetCards";
import checkIfSet from "./gameLogicModules/checkIfSet";
import calculateSetsOnTable from "./gameLogicModules/calculateSetsOnTable";
import switchFoundCardsWithCardsOnTheLastRow, {
  WaitingTableCard,
} from "./gameLogicModules/switchFoundCardsWithCardsOnLast";
import getHint from "./gameLogicModules/getHint";
// Types
import { Card } from "./types";

interface CardPositions {
  cardIdA: number;
  cardIdB: number;
  cardIdC: number;
}

interface CurrentGame {
  cardStack: Card[];
  usedCards: number;
  setTable: Card[];
  endOfGame: boolean;
}

class gameLogic {
  private cardStack: Card[] | null;
  private usedCards: number;
  private setTable: Card[] | null;
  private endOfGame: boolean;

  constructor(currentGame: CurrentGame) {
    if (currentGame) {
      this.cardStack = currentGame.cardStack;
      this.usedCards = currentGame.usedCards;
      this.setTable = currentGame.setTable;
      this.endOfGame = currentGame.endOfGame;
    } else {
      this.cardStack = null;
      this.usedCards = 0;
      this.setTable = null;
      this.endOfGame = false;
    }
  }

  startGame() {
    this.cardStack = createSetCards();
    this.setTable = this.createNewTable();
    while (this.calculateSetsOnTable() == 0) {
      const newCards = this.getNewCards();
      if (newCards === "endOfGame") return;

      this.setTable = this.setTable.concat(newCards);
    }
  }

  saveGame() {
    const game = {
      cardStack: this.cardStack,
      usedCards: this.usedCards,
      setTable: this.setTable,
      endOfGame: this.endOfGame,
    };
    return game;
  }

  calculateSetsOnTable() {
    if (!this.setTable) return 0;
    return calculateSetsOnTable(this.setTable);
  }

  getHint() {
    if (!this.setTable) return [];
    return getHint(this.setTable);
  }

  findSet(cardPositions: CardPositions) {
    if (!this.setTable) return false;

    if (
      !this.checkIfSet(
        cardPositions.cardIdA,
        cardPositions.cardIdB,
        cardPositions.cardIdC
      )
    ) {
      return false;
    }

    if (this.setTable.length > 12 || this.usedCards === 81) {
      this.removeFoundCards(cardPositions);
    } else {
      this.replaceFoundCardsWithNewCards(cardPositions);
    }

    while (this.calculateSetsOnTable() == 0) {
      const newCards = this.getNewCards();
      if (newCards === "endOfGame") {
        return true;
      }
      this.setTable = this.setTable.concat(newCards);
    }

    return true;
  }

  checkIfSet(cardId1: number, cardId2: number, cardId3: number) {
    if (!this.setTable) return false;

    if (checkIfSet(this.setTable, cardId1, cardId2, cardId3)) {
      return true;
    } else {
      return false;
    }
  }

  // These functions are called by the above functions.

  getNewCards() {
    if (!this.cardStack) throw new Error("cardStack is null");

    let newCards = [];

    if (this.usedCards === 81) {
      this.endOfGame = true;
      return "endOfGame";
    }

    while (newCards.length < 3) {
      newCards[newCards.length] = this.cardStack[this.usedCards++];
    }

    return newCards;
  }

  replaceFoundCardsWithNewCards(cardPositions: CardPositions) {
    if (!this.setTable) throw new Error("setTable is null");

    const newCards = this.getNewCards();
    if (newCards === "endOfGame") return;

    const newSetTable = this.setTable.slice();

    newSetTable[cardPositions.cardIdA] = newCards[0];
    newSetTable[cardPositions.cardIdB] = newCards[1];
    newSetTable[cardPositions.cardIdC] = newCards[2];

    this.setTable = newSetTable;
  }

  removeFoundCards(cardPositions: CardPositions) {
    const cardPosArray = [
      cardPositions.cardIdA,
      cardPositions.cardIdB,
      cardPositions.cardIdC,
    ];

    if (!this.setTable) throw new Error("setTable is null");

    let newSetTable: WaitingTableCard[] = this.setTable.slice();

    for (const pos of cardPosArray) {
      newSetTable[pos] = "waiting";
    }

    newSetTable = switchFoundCardsWithCardsOnTheLastRow(
      cardPosArray,
      newSetTable
    );

    this.setTable = newSetTable as Card[];
  }

  createNewTable() {
    if (!this.cardStack) throw new Error("cardStack is null");

    const output: Card[] = [];

    for (var i = 0; i < 12; i++) {
      output[i] = this.cardStack[this.usedCards++];
    }
    this.usedCards = 12;
    return output;
  }
}

export default gameLogic;
