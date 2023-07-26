import GameLogic from "../../../../../gameLogic/gameLogic";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";
import { roomCache } from "../../../../../instances";

export const autoStartKnockoutRound = (roomId: string) => {
  try {
    const room = roomCache.getRoomById(roomId);

    if (!room) return;

    const gameLogic = new GameLogic();
    gameLogic.startGame();

    roomCache.updateGameState(roomId, gameLogic.saveGame());

    updateGameRoom(roomId);
  } catch (e) {}
};
