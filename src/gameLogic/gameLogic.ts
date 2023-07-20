import createSetCards from "./gameLogicModules/createSetCards";
import checkIfSet from "./gameLogicModules/checkIfSet";
import calculateSetsOnTable from "./gameLogicModules/calculateSetsOnTable";
import switchFoundCardsWithCardsOnTheLastRow, {
  WaitingTableCard,
} from "./gameLogicModules/switchFoundCardsWithCardsOnLast";
import getHint from "./gameLogicModules/getHint";
// Types
import { Card } from "./types";

export interface CardPositions {
  cardIdA: number;
  cardIdB: number;
  cardIdC: number;
}

export interface GameSnapshot {
  cardStack: Card[];
  usedCards: number;
  setTable: Card[];
  endOfGame: boolean;
}

class GameLogic {
  private cardStack: Card[];
  private usedCards: number;
  private setTable: Card[];
  private endOfGame: boolean;

  constructor(currentGame?: GameSnapshot) {
    if (currentGame) {
      this.cardStack = currentGame.cardStack;
      this.usedCards = currentGame.usedCards;
      this.setTable = currentGame.setTable;
      this.endOfGame = currentGame.endOfGame;
    } else {
      this.cardStack = createSetCards();
      this.usedCards = 0;
      this.setTable = [];
      this.endOfGame = false;
    }
  }

  startGame() {
    this.createNewTable();
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
    return calculateSetsOnTable(this.setTable);
  }

  getHint() {
    return getHint(this.setTable);
  }

  findSet(cardPositions: CardPositions) {
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
      if (!newCards) {
        return true;
      }
      this.setTable = this.setTable.concat(newCards);
    }

    return true;
  }

  checkIfSet(cardId1: number, cardId2: number, cardId3: number) {
    return checkIfSet(this.setTable, cardId1, cardId2, cardId3);
  }

  // These functions for the purpose of the above functions.
  getNewCards() {
    let newCards = [];

    if (this.usedCards === 81) {
      this.endOfGame = true;
      return null;
    }

    while (newCards.length < 3) {
      newCards[newCards.length] = this.cardStack[this.usedCards];

      this.usedCards++;
    }

    return newCards;
  }

  replaceFoundCardsWithNewCards(cardPositions: CardPositions) {
    const newCards = this.getNewCards();
    if (!newCards) return;

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
    const output: Card[] = [];

    for (let i = 0; i < 12; i++) {
      output[i] = this.cardStack[this.usedCards];
    }
    this.usedCards = 12;
    this.setTable = output;

    while (this.calculateSetsOnTable() === 0) {
      const newCards = this.getNewCards();
      if (!newCards) return;

      this.setTable = this.setTable.concat(newCards);
    }
  }
}

export default GameLogic;
