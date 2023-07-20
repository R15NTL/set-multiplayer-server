import { IOContext } from "../../../../../types/context";
import * as yup from "yup";
import GameLogic from "../../../../../gameLogic/gameLogic";
import { gameEmitters } from "../../../../emitters/game/gameEmitters";
import { updateGameRoom } from "../../../../emitters/game/emitToGame";

export const autoStartKnockoutRound = (context: IOContext, roomId: string) => {
  try {
    const { roomCache } = context;

    const room = roomCache.getRoomById(roomId);

    if (!room) return;

    const gameLogic = new GameLogic();
    gameLogic.startGame();

    roomCache.updateGameState(roomId, gameLogic.saveGame());

    updateGameRoom(context, roomId);
  } catch (e) {}
};
